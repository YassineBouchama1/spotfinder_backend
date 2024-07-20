import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  // POST SIGNUP

  @Post('signup')
  async signup(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  // POST LOGIN
  @Post('login')
  async login(@Body() loginData: LoginDto) {

    return this.authService.login(loginData);
  }

  //TODO: POST REFRESH TOKEN
  // @Post('refresh')
  // async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
  //   return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  // }
}
