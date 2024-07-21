import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WishList, WishListSchema } from 'src/schemas/wish-list.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:WishList.name,schema:WishListSchema}])],

  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
