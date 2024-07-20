import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RoleGuard } from './auth/guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthGuard } from './auth/guards/auth.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @Roles("user")

  @Get()
  getHello(@Req() req) {
    return { message: 'accessed route', userId: req.userId, role: req.role };
  }
}
