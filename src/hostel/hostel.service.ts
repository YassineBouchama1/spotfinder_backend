import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHostelDto } from './dto/create-hostel.dto';
import { UpdateHostelDto } from './dto/update-hostel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hostel, HostelDocument } from 'src/schemas/hostel.schema';
import { Model } from 'mongoose';
import * as geolib from 'geolib';

@Injectable()
export class HostelService {
  constructor(@InjectModel(Hostel.name) private hostelModel: Model<HostelDocument>) {}
  async create(createHostelDto: CreateHostelDto, userId: string): Promise<Hostel> {
    const createdHostel = new this.hostelModel({ ...createHostelDto, userId });
    return createdHostel.save();
  }
  
  

  async findAll(cat?: string, page: number = 1, limit: number = 10, latitude?: number, longitude?: number, maxDistanceKm?: number): Promise<{ hostels: Hostel[], total: number, page: number, pages: number }> {
    const skip = (page - 1) * limit;
    let query: any = {};


 // Check if a category is provided, if so filter the hostels by category, else fetch all hostels
    if (cat && cat !== 'all') {
      query.category = cat;
    }

    const [hostels, total] = await Promise.all([
      this.hostelModel.find(query).exec(),
      this.hostelModel.countDocuments(query)
    ]);


   // If latitude, longitude, and maxDistanceKm are provided, filter hostels by distance
    let filteredHostels = hostels;
    if (latitude !== undefined && longitude !== undefined && maxDistanceKm !== undefined) {
      filteredHostels = hostels.filter(hostel => {
        const distanceInMeters = geolib.getDistance(
          { latitude, longitude },
          { latitude: hostel.latitude, longitude: hostel.longitude }
        );
        return distanceInMeters <= maxDistanceKm * 1000; // Convert km to meters
      });
    }

    const paginatedHostels = filteredHostels.slice(skip, skip + limit);
    const totalFiltered = filteredHostels.length;
    const pages = Math.ceil(totalFiltered / limit);

    return {
      hostels: paginatedHostels,
      total: totalFiltered,
      page,
      pages
    };
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
  
    // private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    //   const toRadians = (angle: number) => angle * (Math.PI / 180);
  
    //   const R = 6371; // Earth's radius in kilometers
    //   const dLat = toRadians(lat2 - lat1);
    //   const dLon = toRadians(lon2 - lon1);
  
    //   const a =
    //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //     Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    //   return R * c; // Distance in kilometers
    // }
  
    // async findAll(cat?: string, page: number = 1, limit: number = 10, latitude?: number, longitude?: number, maxDistanceKm?: number): Promise<{ hostels: Hostel[], total: number, page: number, pages: number }> {
    //   const skip = (page - 1) * limit;
    //   let query: any = {};
  
    //   // Check if a category is provided, if so filter the hostels by category, else fetch all hostels
    //   if (cat && cat !== 'all') {
    //     query.category = cat;
    //   }
  
    //   const [hostels, total] = await Promise.all([
    //     this.hostelModel.find(query).exec(),
    //     this.hostelModel.countDocuments(query)
    //   ]);
  
    //   // If latitude, longitude, and maxDistanceKm are provided, filter hostels by distance
    //   let filteredHostels = hostels;
    //   if (latitude !== undefined && longitude !== undefined && maxDistanceKm !== undefined) {
    //     filteredHostels = hostels.filter(hostel => {
    //       const distance = this.haversineDistance(latitude, longitude, hostel.latitude, hostel.longitude);
    //       return distance <= maxDistanceKm;
    //     });
    //   }
  
    //   const paginatedHostels = filteredHostels.slice(skip, skip + limit);
    //   const totalFiltered = filteredHostels.length;
    //   const pages = Math.ceil(totalFiltered / limit);
  
    //   return {
    //     hostels: paginatedHostels,
    //     total: totalFiltered,
    //     page,
    //     pages
    //   };
    // }
}
