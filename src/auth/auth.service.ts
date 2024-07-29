import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from 'src/schemas/refresh-token.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(signupData: SignupDto) {
    const { email, password, name, role, category  } = signupData;

    // check if email is existing
    const emailIsExisting = await this.userModel.findOne({ email });

    if (emailIsExisting) {
      throw new BadRequestException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user & save it
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role,
      category,
      isOnline: true,
    });
    await newUser.save();

    const tokens = await this.generateUserTokens(newUser);
    return {
      ...tokens,
      // user_code: newUser.id,
    };
  }
  async login(loginData: LoginDto) {
    
    const { email, password } = loginData;

    // check if user exists
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Wrong Credentials');
    }


    // compare password with existing password
    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong Credentials');
    }


    // Generate JWT tokens
    const tokens = await this.generateUserTokens(user);
    return {
      ...tokens,
      user: user,
    };
  }

  async refreshTokens(refreshToken: string) {
    // check if refresh token is valid
    const token = await this.refreshTokenModel.findOne({ token: refreshToken });

    console.log(token);
    // if token is not valid return error message
    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid');
    }

    // check if token has expired
    // (You may want to add this check)

    // get user data
    const user = await this.userModel.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('user is invalid');
    }
    // generate new Token
    return await this.generateUserTokens(user);
  
  }

  async generateUserTokens(user: UserDocument) {
    // create payload
    const payload =  {id: user.id,role:user.role };
 

    // generate new access token
    const access_token = await this.jwtService.signAsync(payload);

    const refresh_token = uuidv4(); // generate refresh token

    await this.storeRefreshToken(refresh_token, user);
    return {
      access_token,
      refresh_token,
    };
  }

  async storeRefreshToken(refreshToken: string, user: UserDocument) {
    // calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    // check if user already has a refresh token
    const existingRefreshToken = await this.refreshTokenModel.findOne({
      userId: user._id,
    });

    // check if refresh token is valid <not expired token>
    if (existingRefreshToken) {
      existingRefreshToken.expiryDate = expiryDate;
      existingRefreshToken.token = refreshToken;
      await existingRefreshToken.save();
      return existingRefreshToken;
    } else {
      // create new refresh token if it doesn't exist
      const newRefreshToken = new this.refreshTokenModel({
        token: refreshToken,
        userId: user._id, // Use _id instead of id
        expiryDate,
      });
      await newRefreshToken.save();
      return newRefreshToken;
    }
  }
}
