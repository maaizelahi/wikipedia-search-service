import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

import { SearchHistory } from './search-history.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async search(
    query: string,
    offset: number = 0,
    limit: number = 10,
    userId: string,
  ): Promise<any> {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${query}&sroffset=${offset}&srlimit=${limit}`;

    try {
      const response = await axios.get(apiUrl);

      // Save search history in the database if user is loggedIn
      if (userId) {
        await this.saveSearchHistory(userId, query);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getPageContent(pageId: number): Promise<any> {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&pageids=${pageId}`;

    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async saveSearchHistory(userId: string, query: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userSearchHistory = this.searchHistoryRepository.create({
      user: user,
      query,
    });

    await this.searchHistoryRepository.save(userSearchHistory);
  }

  async getSearchHistory(
    userId: string,
    offset: number = 0,
    limit: number = 10,
  ): Promise<SearchHistory[]> {
    const searchHistory = await this.searchHistoryRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: offset, // skip records based on offset
      take: limit, // take a specified number of records based on limit
    });

    return searchHistory;
  }
}
