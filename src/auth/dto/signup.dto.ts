import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { BusinessTypes, RoleTypes } from "src/types/user.enum";

export class SignupDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

 
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string

    @IsOptional()
    @IsEnum(BusinessTypes || null)
    category: string | null;


    @IsNotEmpty()
    @IsEnum(RoleTypes)
     role :RoleTypes
}