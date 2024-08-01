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
import { Model, Types } from 'mongoose';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}
  async create(createReservationDto: CreateReservationDto, userId: string) {
    try {
      const { HotelId, checkInDate = "2023-09-21T14:30:00Z", checkOutDate = "2023-09-25T14:30:00Z"  } = createReservationDto;

      // Ensure the dates are properly formatted
      const formattedCheckInDate = new Date(checkInDate);
      const formattedCheckOutDate = new Date(checkOutDate);
 

      // check if the check in date is  bigger than the check out date
      if (checkInDate >= checkOutDate) {
        throw new BadRequestException(
          'Check-in date must be before check-out date',
        );
      }
      const newReservation = new this.reservationModel({
        HotelId,
        userId,
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        status:createReservationDto.status || true
      });

       await newReservation.save();

      return  {message :'Reservation Created successfully'};
    } catch (error) {
      throw new BadRequestException('server Failed ');
    }
  }
    
  async findAll(userId: string) {

      // Fetch all reservations belonging to the userId and populate the Hostel field
      const reservations = await this.reservationModel.find({ userId }).populate('HotelId');

      if (!reservations || reservations?.length === 0) {
       return []
      }

      // Check for missing hotels
      const hasMissingHotels = reservations.some(r => !r.HotelId);
      if (hasMissingHotels) {
        throw new BadRequestException('Some reservations are missing hotel information');
      }
 
  }

  async findOne(id: string, userId: string): Promise<Reservation> {
    // validate input id and userId
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid reservation or user ID');
    }

    // find the reservation in database by id and user id
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // check if this user owns the reservation or not

    if (reservation.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to access this reservation',
      );
    }

    return reservation;
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

  // updating
  async update(
    id: string,
    userId: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid reservation or user ID');
    }

    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.userId.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this reservation',
      );
    }

    // Validate dates if they are being updated
      const checkInDate = new Date(updateReservationDto.checkInDate || reservation.checkInDate );
      const checkOutDate = new Date(updateReservationDto.checkOutDate || reservation.checkOutDate );

      if (checkInDate >= checkOutDate) {
        throw new BadRequestException(
          'Check-in date must be before check-out date',
        );
      }
  

    reservation.status = updateReservationDto.status || reservation.status


    // Update the reservation
    Object.assign(reservation, updateReservationDto);

    const updatedReservation = await reservation.save();

    if (!updatedReservation) {
      throw new BadRequestException('Failed to update reservation');
    }

    return updatedReservation;
  }
}
