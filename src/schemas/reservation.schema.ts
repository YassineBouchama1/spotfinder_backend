import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from "./user.schema";




export type ReservationDocument = HydratedDocument<Reservation>

@Schema()
export class Reservation {

    @Prop({type:MongooseSchema.Types.ObjectId, ref:"Hostel", required: true })
    HotelId: MongooseSchema.Types.ObjectId;
  
    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User', required: true})
    userId: MongooseSchema.Types.ObjectId;
  
    @Prop({ required: true })
    checkInDate: Date;
  
    @Prop({ required: true })
    checkOutDate: Date;

    @Prop({defaultValue:true , required: true})
    status: boolean;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation)