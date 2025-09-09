import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfo } from 'src/interface/user-info.type';
import { GetAuthUser } from 'src/modules/v1/auth/decorators/get-user.decorator';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserData(@GetAuthUser() authUser: UserInfo) {
    return this.userService.getUserData(authUser);
  }
}
