import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchHistory } from './search-history.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

jest.mock('axios');

describe('SearchController', () => {
  let controller: SearchController;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(SearchHistory),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /search', () => {
    it('should return search results', async () => {
      const query = 'NestJS';
      const offset = 0;
      const limit = 10;

      const response = await request(app.getHttpServer())
        .get(`/search?query=${query}&offset=${offset}&limit=${limit}`)
        .expect(200);

      expect(response.body).toBeDefined();
      // Add more assertions based on your expected response
    });

    // Add more test cases for different scenarios (e.g., missing query, invalid parameters, etc.)
  });

  describe('GET /search/page/:pageId', () => {
    it('should return page content', async () => {
      const pageId = 123;

      const response = await request(app.getHttpServer())
        .get(`/search/page/${pageId}`)
        .expect(200);

      expect(response.body).toBeDefined();
      // Add more assertions based on your expected response
    });

    // Add more test cases for different scenarios
  });

  // describe('GET /search/history', () => {
  //   it('should return search history', async () => {
  //     // Mock the user ID in the request
  //     const mockUserId = 'user123';
  //     // const mockRequest = { userId: mockUserId } as Request;

  //     // Mock the service method to return a list of search history
  //     jest
  //       .spyOn(controller['searchService'], 'getSearchHistory')
  //       .mockResolvedValue([]);

  //     const response = await request(app.getHttpServer())
  //       .get('/search/history')
  //       .set('Authorization', 'Bearer mockToken') // Provide a mock token if needed
  //       .send(mockRequest)
  //       .expect(200);

  //     expect(response.body).toBeDefined();
  //     // Add more assertions based on your expected response
  //   });

  //   // Add more test cases for different scenarios
  // });
});
