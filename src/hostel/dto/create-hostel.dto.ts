


import { IsString, IsNumber, IsBoolean, IsArray, IsNotEmpty, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// class AddressDto {
//   @IsString()
//   @IsNotEmpty()
//   address: string;

//   @IsString()
//   @IsNotEmpty()
//   city: string;

//   @IsString()
//   @IsNotEmpty()
//   country: string;
// }

export class CreateHostelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  About: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

 

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNumber()
  @IsNotEmpty()
  beds: number;

  @IsBoolean()
  status: boolean;
}
