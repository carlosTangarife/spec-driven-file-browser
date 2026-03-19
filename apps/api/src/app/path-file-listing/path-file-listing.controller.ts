import { Controller, Get, Query } from '@nestjs/common';
import { PathFileListingService } from './path-file-listing.service';
import { ListQueryDto, TreeQueryDto } from './dto';
import { parseTreeDepthParam } from './tree-depth';

@Controller('listing')
export class PathFileListingController {
  constructor(private readonly listingService: PathFileListingService) {}

  @Get()
  async list(@Query() query: ListQueryDto) {
    return this.listingService.list(query.path);
  }

  @Get('tree')
  async tree(@Query() query: TreeQueryDto) {
    const depth = parseTreeDepthParam(query.depth);
    return this.listingService.getDirectoryTree(query.path, depth);
  }
}
