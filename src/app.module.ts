import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'
import { ReservationModule } from './reservation/reservation.module';
import { WishlistModule } from './wishlist/wishlist.module';
import config, { jwtConstants } from 'config/config';
import { HostelModule } from './hostel/hostel.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
        // signOptions: { expiresIn: '7d' },
      }),
      global: true,
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // uri: configService.get<string>('database.url'),
        uri: 'mongodb+srv://siskodb:sisko007SP@cluster0.2pdvdr6.mongodb.net/spotFinder?retryWrites=true&w=majority',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    ReservationModule,
    WishlistModule,
    HostelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}