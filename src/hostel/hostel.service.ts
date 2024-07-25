import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hostel, HostelDocument } from 'src/schemas/hostel.schema';
import { Model } from 'mongoose';

@Injectable()
export class HostelService {
  constructor(@InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>) {}
  async create(createHostelDto: CreateHostelDto, userId: string): Promise<Hostel> {
    const createdHostel = new this.hostelModel({ ...createHostelDto, userId });
    return createdHostel.save();
  }

  async findAll(): Promise<Hostel[]> {
    return await this.hostelModel.find().exec();
  }

  async findOne(id: string): Promise<Hostel> {
    const hostel = await this.hostelModel.findById(id).exec();
    if (!hostel) {
      throw new NotFoundException(`Hostel with ID ${id} not found`);
    }
    return hostel;
  }

  async update(id: string, updateHostelDto: UpdateHostelDto, userId: string): Promise<Hostel> {
    const updatedHostel = await this.hostelModel
      .findOneAndUpdate({ _id: id, userId }, updateHostelDto, { new: true })
      .exec();
    if (!updatedHostel) {
      throw new NotFoundException(`Hostel with ID ${id} not found`);
    }
    return updatedHostel;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.hostelModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!result) {
      throw new NotFoundException(`Hostel with ID ${id} not found`);
    }
  }
}
