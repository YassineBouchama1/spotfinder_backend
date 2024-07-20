import { PartialType } from '@nestjs/mapped-types';
import { SignupDto } from './SignupDto';

export class UpdateUserDto extends PartialType(SignupDto) {}
