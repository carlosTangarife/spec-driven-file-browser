import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilePreviewResponseDto } from './dto/file-preview-response.dto';
import { PathFileContentService } from './path-file-content.service';

@ApiTags('preview')
@Controller('listing')
export class PathFileContentController {
  constructor(private readonly contentService: PathFileContentService) {}

  @Get('preview')
  @ApiOperation({ summary: 'Read a UTF-8 text preview of a file' })
  @ApiQuery({
    name: 'path',
    required: true,
    description: 'Wire path to the file (relative under allowed root).',
    example: 'package.json',
  })
  @ApiOkResponse({ type: FilePreviewResponseDto })
  preview(@Query('path') path?: string) {
    return this.contentService.readPreview(path);
  }
}
