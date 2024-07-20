import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BusinessTypes, RoleTypes } from 'src/types/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({enum: BusinessTypes, default: BusinessTypes.COFFEE})
  category: string;

  @Prop({ required: true, unique: true })
  email: string;  // Changed from number to string

  @Prop({ required: true })
  password: string;

  @Prop({enum: RoleTypes, default: RoleTypes.Business})
  role: string;

  @Prop({default: false})
  isOnline: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);