import { Module } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { HostelController } from './hostel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hostel, HostelSchema } from 'src/schemas/hostel.schema';

@Module({

  imports:[MongooseModule.forFeature([{name:Hostel.name,schema:HostelSchema}])],
  controllers: [HostelController],
  providers: [HostelService],

})
export class HostelModule {}
