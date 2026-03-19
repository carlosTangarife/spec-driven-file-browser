import { Controller, Get, Query } from '@nestjs/common';
import { PathFileContentService } from './path-file-content.service';

@Controller('listing')
export class PathFileContentController {
  constructor(private readonly contentService: PathFileContentService) {}

  @Get('preview')
  preview(@Query('path') path?: string) {
    return this.contentService.readPreview(path);
  }
}
