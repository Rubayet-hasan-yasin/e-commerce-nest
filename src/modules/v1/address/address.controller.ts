import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { GetAuthUser } from 'src/modules/v1/auth/decorators/get-user.decorator';
import { UserInfo } from 'src/interface/user-info.type';

@Controller({ path: 'address', version: '1' })
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(
    @Body() createAddressDto: CreateAddressDto,
    @GetAuthUser() authUser: UserInfo,
  ) {
    return this.addressService.create(createAddressDto, authUser);
  }

  @Get()
  findAllByUser(@GetAuthUser() authUser: UserInfo) {
    return this.addressService.findMany(authUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
