import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PathFileListingModule } from './path-file-listing/path-file-listing.module';

@Module({
  imports: [PathFileListingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
