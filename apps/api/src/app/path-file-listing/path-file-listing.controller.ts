import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PathFileListingService } from './path-file-listing.service';
import { ListEntryDto, ListQueryDto, TreeNodeDto, TreeQueryDto } from './dto';
import { parseTreeDepthParam } from './tree-depth';

@ApiTags('listing')
@ApiExtraModels(ListEntryDto, TreeNodeDto)
@Controller('listing')
export class PathFileListingController {
  constructor(private readonly listingService: PathFileListingService) {}

  @Get()
  @ApiOperation({ summary: 'List immediate children of a directory' })
  @ApiOkResponse({ description: 'Sorted entries (directories first).', type: [ListEntryDto] })
  async list(@Query() query: ListQueryDto) {
    return this.listingService.list(query.path);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Nested directory tree up to a depth' })
  @ApiOkResponse({ description: 'Tree nodes under the anchor path.', type: [TreeNodeDto] })
  async tree(@Query() query: TreeQueryDto) {
    const depth = parseTreeDepthParam(query.depth);
    return this.listingService.getDirectoryTree(query.path, depth);
  }
}
