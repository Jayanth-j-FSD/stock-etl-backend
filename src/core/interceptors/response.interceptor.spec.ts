import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockResponse = {
      statusCode: 200,
    };

    mockRequest = {
      method: 'GET',
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('Response wrapping', () => {
    it('should wrap response data for GET request', (done) => {
      const responseData = { id: 1, name: 'Test' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'GET';
      mockResponse.statusCode = 200;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toHaveProperty('statusCode', 200);
        expect(result).toHaveProperty('message', 'Data retrieved successfully');
        expect(result).toHaveProperty('data', responseData);
        expect(result).toHaveProperty('timestamp');
        done();
      });
    });

    it('should wrap response data for POST request', (done) => {
      const responseData = { id: 1, name: 'Created' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'POST';
      mockResponse.statusCode = 201;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toHaveProperty('statusCode', 201);
        expect(result).toHaveProperty('message', 'Resource created successfully');
        expect(result).toHaveProperty('data', responseData);
        done();
      });
    });

    it('should wrap response data for PUT request', (done) => {
      const responseData = { id: 1, name: 'Updated' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'PUT';
      mockResponse.statusCode = 200;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toHaveProperty('message', 'Resource updated successfully');
        expect(result).toHaveProperty('data', responseData);
        done();
      });
    });

    it('should wrap response data for PATCH request', (done) => {
      const responseData = { id: 1, name: 'Patched' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'PATCH';
      mockResponse.statusCode = 200;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toHaveProperty('message', 'Resource updated successfully');
        expect(result).toHaveProperty('data', responseData);
        done();
      });
    });

    it('should wrap response data for DELETE request', (done) => {
      const responseData = null;
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'DELETE';
      mockResponse.statusCode = 200;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toHaveProperty('message', 'Resource deleted successfully');
        expect(result).toHaveProperty('data', null);
        done();
      });
    });

    it('should use default message for unknown HTTP method', (done) => {
      const responseData = { result: 'success' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'OPTIONS';
      mockResponse.statusCode = 200;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toHaveProperty('message', 'Operation successful');
        done();
      });
    });
  });

  describe('Special cases', () => {
    it('should not wrap response if status code is 204 No Content', (done) => {
      const responseData = null;
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'DELETE';
      mockResponse.statusCode = 204;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toBe(null);
        expect(result).not.toHaveProperty('statusCode');
        done();
      });
    });

    it('should not wrap if response is already wrapped', (done) => {
      const wrappedResponse = {
        statusCode: 200,
        message: 'Custom message',
        data: { id: 1 },
        timestamp: '2024-01-01T00:00:00.000Z',
      };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(wrappedResponse));
      mockRequest.method = 'GET';

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toEqual(wrappedResponse);
        done();
      });
    });

    it('should handle empty response data', (done) => {
      mockCallHandler.handle = jest.fn().mockReturnValue(of(null));
      mockRequest.method = 'GET';

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result).toHaveProperty('data', null);
        expect(result).toHaveProperty('statusCode', 200);
        done();
      });
    });

    it('should handle array response data', (done) => {
      const responseData = [{ id: 1 }, { id: 2 }];
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'GET';

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result.data).toEqual(responseData);
        expect(Array.isArray(result.data)).toBe(true);
        done();
      });
    });

    it('should handle string response data', (done) => {
      const responseData = 'Success message';
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'GET';

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result.data).toBe('Success message');
        done();
      });
    });
  });

  describe('Timestamp', () => {
    it('should include ISO timestamp in response', (done) => {
      const mockISOString = '2024-01-01T12:00:00.000Z';
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockISOString);

      const responseData = { id: 1 };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'GET';

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result.timestamp).toBe(mockISOString);
        done();
      });
    });

    it('should generate new timestamp for each request', (done) => {
      const responseData = { id: 1 };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'GET';

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result.timestamp).toBeDefined();
        expect(typeof result.timestamp).toBe('string');
        done();
      });
    });
  });

  describe('Status codes', () => {
    it('should include correct status code in response', (done) => {
      const responseData = { id: 1 };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'POST';
      mockResponse.statusCode = 201;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result.statusCode).toBe(201);
        done();
      });
    });

    it('should handle 200 OK status code', (done) => {
      const responseData = { id: 1 };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));
      mockRequest.method = 'GET';
      mockResponse.statusCode = 200;

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
        expect(result.statusCode).toBe(200);
        done();
      });
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
