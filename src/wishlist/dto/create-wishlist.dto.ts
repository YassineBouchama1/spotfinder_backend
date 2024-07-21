import { IsNotEmpty, IsString } from "class-validator";

export class CreateWishlistDto {

    @IsString()
    @IsNotEmpty()
    hotelId: string;
}
