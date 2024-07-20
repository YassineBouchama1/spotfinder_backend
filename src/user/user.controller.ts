import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/SignupDto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto);
  }

}
