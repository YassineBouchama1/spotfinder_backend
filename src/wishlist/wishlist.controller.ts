import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';


@UseGuards(AuthGuard,RoleGuard)

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto,@Req() req) {
    return this.wishlistService.create(createWishlistDto,req.userId);
  }

  @Get()
  findAll(@Req() req) {
    return this.wishlistService.findAll(req.userId);
  }



  @Delete(':id')
  remove(@Param('id') id: string,@Req() req) {
    return this.wishlistService.remove(id,req.userId);
  }


  @Get(':id')
  get(@Param('id') id: string,@Req() req) {
    return this.wishlistService.findOne(id,req.userId);
  }
}
