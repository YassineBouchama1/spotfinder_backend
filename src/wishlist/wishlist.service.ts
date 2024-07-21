import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { WishList, WishListDocument } from 'src/schemas/wish-list.schema';
import { Model } from 'mongoose';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(WishList.name) private wishListModal: Model<WishListDocument>,
  ) {}
  async create(createWishlistDto: CreateWishlistDto, userId: string) {
    try {
      const { hotelId } = createWishlistDto;

      const newWishList = new this.wishListModal({
        hotelId,
        userId,
      });
       await newWishList.save();
      return  'WishList Created successfully';
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }
  }

  async findAll(userId: string) {
    try {
      // bring all wishList belong to userid
      const wishList = await this.wishListModal.find({ userId });

      if (!wishList) {
        throw new BadRequestException('No wishList found');
      }
      return wishList;
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }
  }

  async remove(id: string, userId: string) {
    try {
      const wishList = await this.wishListModal.findById(id);

      if (!wishList) {
        throw new BadRequestException('WishList not found');
      }

      if (wishList.userId.toString() != userId) {
        throw new UnauthorizedException('Unauthorized to delete this wishList');
      }

      // remove the wish list

      const isRemoved = await this.wishListModal.deleteOne({ _id: id });

      if (isRemoved.deletedCount === 0) {
        throw new NotFoundException('Reservation not found');
      }

      return 'WishList deleted successfully';
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }
  }
}
