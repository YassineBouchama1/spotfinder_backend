import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReservationDto {

@IsString()
HotelId: string;




@IsOptional()
checkInDate: Date;


@IsOptional()
checkOutDate: Date;


@IsOptional()
status:boolean

}
