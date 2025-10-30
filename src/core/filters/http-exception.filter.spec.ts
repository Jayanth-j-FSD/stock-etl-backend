import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      method: 'GET',
      url: '/api/test',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch HttpException', () => {
    it('should handle HttpException with string message', () => {
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      const timestamp = new Date().toISOString();

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(timestamp);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Not Found'],
        errors: undefined,
        timestamp,
        path: '/api/test',
        method: 'GET',
      });
    });

    it('should handle HttpException with object response', () => {
      const exceptionResponse = {
        message: 'Validation failed',
        errors: { email: 'Invalid email' },
      };
      const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);
      const timestamp = new Date().toISOString();

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(timestamp);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Validation failed'],
        errors: { email: 'Invalid email' },
        timestamp,
        path: '/api/test',
        method: 'GET',
      });
    });

    it('should handle HttpException with array message', () => {
      const exceptionResponse = {
        message: ['Error 1', 'Error 2'],
      };
      const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);
      const timestamp = new Date().toISOString();

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(timestamp);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Error 1', 'Error 2'],
        errors: undefined,
        timestamp,
        path: '/api/test',
        method: 'GET',
      });
    });

    it('should handle Unauthorized exception', () => {
      const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: ['Unauthorized'],
        })
      );
    });

    it('should handle Forbidden exception', () => {
      const exception = new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.FORBIDDEN,
          message: ['Forbidden resource'],
        })
      );
    });
  });

  describe('catch non-HttpException Error', () => {
    it('should handle generic Error as Internal Server Error', () => {
      const exception = new Error('Database connection failed');
      const timestamp = new Date().toISOString();

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(timestamp);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Database connection failed'],
        errors: undefined,
        timestamp,
        path: '/api/test',
        method: 'GET',
      });
    });

    it('should handle TypeError as Internal Server Error', () => {
      const exception = new TypeError('Cannot read property of undefined');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ['Cannot read property of undefined'],
        })
      );
    });
  });

  describe('catch unknown exception', () => {
    it('should handle unknown exception type', () => {
      const exception = 'String error';
      const timestamp = new Date().toISOString();

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(timestamp);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Internal server error'],
        errors: undefined,
        timestamp,
        path: '/api/test',
        method: 'GET',
      });
    });

    it('should handle null exception', () => {
      filter.catch(null, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ['Internal server error'],
        })
      );
    });
  });

  describe('error response format', () => {
    it('should include all required fields in error response', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: expect.any(Number),
          message: expect.any(Array),
          timestamp: expect.any(String),
          path: expect.any(String),
          method: expect.any(String),
        })
      );
    });

    it('should format timestamp as ISO string', () => {
      const exception = new HttpException('Test', HttpStatus.BAD_REQUEST);
      const isoString = '2024-01-01T00:00:00.000Z';

      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(isoString);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: isoString,
        })
      );
    });

    it('should include request path and method', () => {
      mockRequest = {
        method: 'POST',
        url: '/api/users',
      };

      const exception = new HttpException('Test', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/users',
          method: 'POST',
        })
      );
    });
  });
});
