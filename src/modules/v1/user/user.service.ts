import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserInfo } from 'src/interface/user-info.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByPhone(phone: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ phone }],
    });

    return user;
  }

  createUser(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  getUserData(user: UserInfo) {
    const userData = this.userRepository.findOne({
      where: { phone: user.phone },
      select: ['id', 'fullName', 'phone', 'role'],
    });

    return userData;
  }
}
