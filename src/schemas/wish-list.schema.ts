import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Mongoose,Schema as MongooseSchema } from 'mongoose';

export type WishListDocument = HydratedDocument<WishList>;

@Schema()
export class WishList {
  @Prop()
  hotelId: string;

  @Prop({type:MongooseSchema.Types.ObjectId ,  ref: 'User', required: true})
  userId: MongooseSchema.Types.ObjectId;
}


export  const WishListSchema = SchemaFactory.createForClass(WishList);