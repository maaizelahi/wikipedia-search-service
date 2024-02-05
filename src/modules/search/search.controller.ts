import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { SearchService } from './search.service';
import { SearchHistory } from './search-history.entity';

@Controller('search')
@ApiTags('Search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiQuery({ name: 'query', required: true, description: 'The search query' })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'The offset for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The limit for pagination',
  })
  async search(
    @Query('query') query: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Request() req: any,
  ): Promise<any> {
    try {
      const userId = req.userId;
      return await this.searchService.search(query, offset, limit, userId);
    } catch (error) {
      throw error;
    }
  }

  @Get('page/:pageId')
  @ApiParam({
    name: 'pageId',
    required: true,
    description: 'The ID of the Wikipedia page',
  })
  async getPageContent(@Param('pageId') pageId: number): Promise<any> {
    try {
      return await this.searchService.getPageContent(pageId);
    } catch (error) {
      throw error;
    }
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'The offset for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The limit for pagination',
  })
  async getSearchHistory(
    @Request() req: any,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<SearchHistory[]> {
    const userId = req.userId;
    return await this.searchService.getSearchHistory(userId, offset, limit);
  }
}
