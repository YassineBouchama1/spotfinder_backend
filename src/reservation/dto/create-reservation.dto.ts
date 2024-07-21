import { IsNotEmpty, IsString } from "class-validator";

export class CreateReservationDto {

@IsString()
HotelId: string;




@IsNotEmpty()
checkInDate: Date;


@IsNotEmpty()
checkOutDate: Date;




}
