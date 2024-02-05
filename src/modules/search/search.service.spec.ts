import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SearchService } from './search.service';
import { SearchHistory } from './search-history.entity';
import { User } from '../auth/user.entity';

jest.mock('axios');

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should search and save history', async () => {
    const query = 'NestJS';
    const userId = 'user123';
    const offset = 0;
    const limit = 10;

    const axiosMock = jest.spyOn(axios, 'get').mockResolvedValue({ data: {} });
    const saveSearchHistoryMock = jest
      .spyOn(service, 'saveSearchHistory')
      .mockResolvedValue();

    const result = await service.search(query, offset, limit, userId);

    expect(result).toBeDefined();
    expect(axiosMock).toHaveBeenCalledWith(expect.any(String));
    expect(saveSearchHistoryMock).toHaveBeenCalledWith(userId, query);
  });

  it('should get page content', async () => {
    const pageId = 123;

    const axiosMock = jest.spyOn(axios, 'get').mockResolvedValue({ data: {} });

    const result = await service.getPageContent(pageId);

    expect(result).toBeDefined();
    expect(axiosMock).toHaveBeenCalledWith(expect.any(String));
  });

  it('should save search history', async () => {
    const userId = 'user123';
    const query = 'NestJS';

    const findOneMock = jest
      .spyOn(service['userRepository'], 'findOne')
      .mockResolvedValue({
        id: userId,
        username: 'test',
        password: 'password',
        searchHistory: [],
      } as User);
    const createMock = jest
      .spyOn(service['searchHistoryRepository'], 'create')
      .mockReturnValue({} as SearchHistory);
    const saveMock = jest
      .spyOn(service['searchHistoryRepository'], 'save')
      .mockImplementation((entity) => {
        // Adjust this part based on your actual entity structure
        return Promise.resolve({
          ...entity,
          id: 'someId',
          createdAt: new Date(),
        } as SearchHistory);
      });

    await service.saveSearchHistory(userId, query);

    expect(findOneMock).toHaveBeenCalledWith({ where: { id: userId } });
    expect(createMock).toHaveBeenCalledWith({
      user: expect.any(Object),
      query,
    });
    expect(saveMock).toHaveBeenCalled();
  });

  it('should get search history', async () => {
    const userId = 'user123';

    const findMock = jest
      .spyOn(service['searchHistoryRepository'], 'find')
      .mockResolvedValue([]);

    const result = await service.getSearchHistory(userId);

    expect(result).toBeDefined();
    expect(findMock).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  });
});
