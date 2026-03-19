import { Module } from '@nestjs/common';
import { PathFileListingController } from './path-file-listing.controller';
import { PathFileListingService } from './path-file-listing.service';

@Module({
  controllers: [PathFileListingController],
  providers: [PathFileListingService],
})
export class PathFileListingModule {}
