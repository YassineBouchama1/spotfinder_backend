import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';


@UseGuards(AuthGuard,RoleGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
 async create(@Body() createReservationDto: CreateReservationDto,@Req() req ) {
    return await this.reservationService.create(createReservationDto,req.userId);
  }

  @Get()
  async findAll(@Req() req ) {
    return await this.reservationService.findAll(req.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string,@Req() req ) {
    return await this.reservationService.findOne(id,req.userId);
  }

  @Patch(':id')
  async  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto,@Req() req) {
    return await this.reservationService.update(id, req.userId,updateReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string,@Req() req ) {
    return await this.reservationService.remove(id,req.userId);
  }
}
