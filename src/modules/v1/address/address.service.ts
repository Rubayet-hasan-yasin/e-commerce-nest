import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserInfo } from 'src/interface/user-info.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(dto: CreateAddressDto, user: UserInfo) {
    if (dto.phone !== user.phone) {
      throw new ForbiddenException(
        'Phone number does not match authenticated user',
      );
    }

    if (!dto.id) {
      const address = this.addressRepository.create({
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,
        type: dto.type,
        apartment: dto.apartment,
        floor: dto.floor,
      });

      const newAddress = await this.addressRepository.save(address);

      return { data: newAddress, message: 'Address created successfully' };
    }

    const existingAddress = await this.addressRepository.findOneBy({
      id: dto.id,
    });

    if (!existingAddress || existingAddress.phone !== user.phone) {
      throw new ForbiddenException('Address not found or unauthorized');
    }

    const fieldsToCompare = [
      'fullName',
      'address',
      'type',
      'apartment',
      'floor',
    ] as const;

    const hasChanges = fieldsToCompare.some(
      (key) => dto[key] !== existingAddress[key],
    );

    if (!hasChanges) {
      return { data: existingAddress, message: 'No changes detected' };
    }

    const updatedAddress = await this.addressRepository.save({
      ...existingAddress,
      fullName: dto.fullName,
      address: dto.address,
      type: dto.type,
      apartment: dto.apartment,
      floor: dto.floor,
    });

    return { data: updatedAddress, message: 'Address updated successfully' };
  }

  findMany(user: UserInfo) {
    return this.addressRepository.findBy({ phone: user.phone });
  }

  async remove(id: number) {
    const address = await this.addressRepository.findBy({ id });

    if (!address) {
      throw new ForbiddenException('Address not found');
    }

    await this.addressRepository.remove(address);

    return { message: 'Address removed successfully' };
  }
}
