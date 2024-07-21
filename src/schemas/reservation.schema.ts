import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from "./user.schema";




export type ReservationDocument = HydratedDocument<Reservation>

@Schema()
export class Reservation {

    @Prop({ required: true })
    HotelId: string;
  
    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User', required: true})
    userId: MongooseSchema.Types.ObjectId;
  
    @Prop({ required: true })
    checkInDate: Date;
  
    @Prop({ required: true })
    checkOutDate: Date;

}

export const ReservationSchema = SchemaFactory.createForClass(Reservation)