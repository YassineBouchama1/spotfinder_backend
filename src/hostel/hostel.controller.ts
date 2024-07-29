import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleTypes } from 'src/types/user.enum';
import { Hostel } from 'src/schemas/hostel.schema';

@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}



  // Private Method
  @UseGuards(AuthGuard,RoleGuard)
@Roles(RoleTypes.Business)
  @Post()
  async create(@Body() createHostelDto: CreateHostelDto,@Req() req) {
    return await this.hostelService.create(createHostelDto,req.userId);
  }

  @Get()
  async findAll(
    @Query('cat') cat?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('maxDistanceKm') maxDistanceKm?: number
  ): Promise<{ hostels: Hostel[], total: number, page: number, pages: number }> {
    return await this.hostelService.findAll(cat, page, limit, latitude, longitude, maxDistanceKm);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hostelService.findOne(id);
  }

    // Private Method
    @UseGuards(AuthGuard,RoleGuard)
    @Roles(RoleTypes.Business)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateHostelDto: UpdateHostelDto,@Req() req) {
    return await this.hostelService.update(id, updateHostelDto,req.userId);
  }

    // Private Method
    @UseGuards(AuthGuard,RoleGuard)
    @Roles(RoleTypes.Business)
  @Delete(':id')
  async remove(@Param('id') id: string,@Req() req) {
    return await this.hostelService.remove(id,req.userId);
  }
}
