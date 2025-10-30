import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let mockRequest: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);

    mockRequest = {
      method: 'GET',
      url: '/api/test',
      body: { name: 'test' },
      params: { id: '1' },
      query: { page: '1' },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    };

    jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log incoming request with method, url, params, query, and body', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockCallHandler.handle = jest.fn().mockReturnValue(of({ result: 'success' }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Incoming Request: GET /api/test'),
      );
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Params: {"id":"1"}'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Query: {"page":"1"}'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Body: {"name":"test"}'));
      done();
    });
  });

  it('should log successful response with duration', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockCallHandler.handle = jest.fn().mockReturnValue(of({ result: 'success' }));

    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1250); // End time

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith('Outgoing Response: GET /api/test - 250ms - Success');
      done();
    });
  });

  it('should log error response with duration and error message', (done) => {
    const errorSpy = jest.spyOn(interceptor['logger'], 'error');
    const error = new Error('Test error');
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1500); // End time

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: () => {
        expect(errorSpy).toHaveBeenCalledWith(
          'Outgoing Response: GET /api/test - 500ms - Error: Test error',
        );
        done();
      },
    });
  });

  it('should handle POST request', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockRequest.method = 'POST';
    mockRequest.url = '/api/users';
    mockCallHandler.handle = jest.fn().mockReturnValue(of({ id: 1, name: 'John' }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Incoming Request: POST /api/users'),
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Outgoing Response: POST /api/users'),
      );
      done();
    });
  });

  it('should handle PUT request', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockRequest.method = 'PUT';
    mockRequest.url = '/api/users/1';
    mockCallHandler.handle = jest.fn().mockReturnValue(of({ updated: true }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Incoming Request: PUT /api/users/1'),
      );
      done();
    });
  });

  it('should handle DELETE request', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockRequest.method = 'DELETE';
    mockRequest.url = '/api/users/1';
    mockCallHandler.handle = jest.fn().mockReturnValue(of(null));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Incoming Request: DELETE /api/users/1'),
      );
      done();
    });
  });

  it('should handle request with empty params, query, and body', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockRequest = {
      method: 'GET',
      url: '/api/test',
      body: {},
      params: {},
      query: {},
    };
    mockCallHandler.handle = jest.fn().mockReturnValue(of({ result: 'success' }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Params: {}'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Query: {}'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Body: {}'));
      done();
    });
  });

  it('should measure response time accurately', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockCallHandler.handle = jest.fn().mockReturnValue(of({ result: 'success' }));

    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(2000); // End time (1000ms later)

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('1000ms'));
      done();
    });
  });

  it('should call next.handle()', (done) => {
    mockCallHandler.handle = jest.fn().mockReturnValue(of({ result: 'success' }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(mockCallHandler.handle).toHaveBeenCalled();
      done();
    });
  });
});
