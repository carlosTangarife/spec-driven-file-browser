import { Controller, Get, Query } from '@nestjs/common';
import { PathFileListingService } from './path-file-listing.service';
import { ListQueryDto } from './dto';

@Controller('listing')
export class PathFileListingController {
  constructor(private readonly listingService: PathFileListingService) {}

  @Get()
  async list(@Query() query: ListQueryDto) {
    return this.listingService.list(query.path);
  }
}
