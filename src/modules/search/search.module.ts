import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchHistory } from './search-history.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchHistory, User])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
