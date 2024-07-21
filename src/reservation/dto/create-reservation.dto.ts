import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReservationDto {

@IsString()
HotelId: string;




@IsNotEmpty()
checkInDate: Date;


@IsNotEmpty()
checkOutDate: Date;


@IsOptional()
status:boolean

}
