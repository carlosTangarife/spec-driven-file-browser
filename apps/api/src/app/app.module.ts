import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PathFileContentModule } from './path-file-content/path-file-content.module';
import { PathFileListingModule } from './path-file-listing/path-file-listing.module';

@Module({
  imports: [PathFileListingModule, PathFileContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
