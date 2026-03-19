import { Module } from '@nestjs/common';
import { PathFileContentController } from './path-file-content.controller';
import { PathFileContentService } from './path-file-content.service';

@Module({
  controllers: [PathFileContentController],
  providers: [PathFileContentService],
})
export class PathFileContentModule {}
