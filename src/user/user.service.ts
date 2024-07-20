import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/SignupDto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModal : Model<User>){}
async signup(signupDto : SignupDto) {

}
}
