import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Reservation,
  ReservationDocument,
} from 'src/schemas/reservation.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}
  async create(createReservationDto: CreateReservationDto, userId: string) {
    try {
      const newReservation = await this.reservationModel.create({
        ...createReservationDto,
        userId,
      });
      if (!newReservation) {
        throw new BadRequestException('Failed to create reservation');
      }

      return { message: 'Reservation created successfully' };
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }
  }

  async findAll(userId: string) {
    try {
      // bring all reservation belong to userid
      const reservations = await this.reservationModel.find({ userId });
      if (!reservations) {
        throw new BadRequestException('No reservations found');
      }
      return reservations;
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }
  }

  async findOne(id: number, userId: string) {
    try {
      const isExist = await this.reservationModel.findById(id);

      // check if reservation exists or this user he's owen the reservation
      if (!isExist || isExist?.userId.toString() === userId) {
        throw new NotFoundException(
          'Reservation not found or its not yours ',
        );
      }

      return isExist;
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }

  
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const reservation = await this.reservationModel.findById(id);

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }


      // check if this user owns the reservation or not
      if (reservation.userId.toString() != userId) {
        throw new UnauthorizedException(
          'You are not authorized to remove this reservation',
        );
      }

      const result = await this.reservationModel.deleteOne({ _id: id });

      // if return value is 0 then return error message
      if (result.deletedCount === 0) {
        throw new NotFoundException('Reservation not found');
      }
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }
  }
}
