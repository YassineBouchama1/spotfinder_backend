import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type HostelDocument = HydratedDocument<Hostel>;

@Schema()
export class Hostel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  About: string;

  @Prop({ required: true })
  address: string

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amenities: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  images: string[];

  @Prop({ required: true })
  beds: number;

  @Prop({ default: true })
  status: boolean;
}

export const HostelSchema = SchemaFactory.createForClass(Hostel);
