import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';

// Mock the Logger class
const mockLoggerInstance = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    Logger: jest.fn().mockImplementation(() => mockLoggerInstance),
  };
});

describe('AppLoggerService', () => {
  let service: AppLoggerService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLoggerService],
    }).compile();

    service = module.get<AppLoggerService>(AppLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setContext', () => {
    it('should set context and create new Logger with context', () => {
      service.setContext('TestContext');

      expect(Logger).toHaveBeenCalledWith('TestContext');
    });
  });

  describe('log', () => {
    it('should call logger.log with message and context', () => {
      service.setContext('TestContext');
      service.log('Test message');

      expect(mockLoggerInstance.log).toHaveBeenCalledWith('Test message', 'TestContext');
    });

    it('should use provided context over default context', () => {
      service.setContext('DefaultContext');
      service.log('Test message', 'CustomContext');

      expect(mockLoggerInstance.log).toHaveBeenCalledWith('Test message', 'CustomContext');
    });

    it('should log without context if none is set', () => {
      service.log('Test message');

      expect(mockLoggerInstance.log).toHaveBeenCalledWith('Test message', undefined);
    });
  });

  describe('error', () => {
    it('should call logger.error with message, trace and context', () => {
      service.setContext('TestContext');
      service.error('Error message', 'Stack trace');

      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Error message',
        'Stack trace',
        'TestContext',
      );
    });

    it('should use provided context over default context', () => {
      service.setContext('DefaultContext');
      service.error('Error message', 'Stack trace', 'CustomContext');

      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        'Error message',
        'Stack trace',
        'CustomContext',
      );
    });
  });

  describe('warn', () => {
    it('should call logger.warn with message and context', () => {
      service.setContext('TestContext');
      service.warn('Warning message');

      expect(mockLoggerInstance.warn).toHaveBeenCalledWith('Warning message', 'TestContext');
    });
  });

  describe('debug', () => {
    it('should call logger.debug with message and context', () => {
      service.setContext('TestContext');
      service.debug('Debug message');

      expect(mockLoggerInstance.debug).toHaveBeenCalledWith('Debug message', 'TestContext');
    });
  });

  describe('verbose', () => {
    it('should call logger.verbose with message and context', () => {
      service.setContext('TestContext');
      service.verbose('Verbose message');

      expect(mockLoggerInstance.verbose).toHaveBeenCalledWith('Verbose message', 'TestContext');
    });
  });

  describe('logRequest', () => {
    it('should log HTTP request with method and url', () => {
      service.logRequest('GET', '/api/users');

      expect(mockLoggerInstance.log).toHaveBeenCalledWith('[Request] GET /api/users');
    });

    it('should include userId in request log when provided', () => {
      service.logRequest('POST', '/api/orders', 'user123');

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        '[Request] POST /api/orders - User: user123',
      );
    });
  });

  describe('logResponse', () => {
    it('should log HTTP response with status and duration', () => {
      service.logResponse('GET', '/api/users', 200, 150);

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        '[Response] GET /api/users - 200 (150ms)',
      );
    });

    it('should log error responses', () => {
      service.logResponse('POST', '/api/auth/login', 401, 50);

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        '[Response] POST /api/auth/login - 401 (50ms)',
      );
    });
  });

  describe('logDatabaseQuery', () => {
    it('should log database query without duration', () => {
      service.logDatabaseQuery('SELECT * FROM users');

      expect(mockLoggerInstance.debug).toHaveBeenCalledWith('[Database] SELECT * FROM users');
    });

    it('should log database query with duration', () => {
      service.logDatabaseQuery('SELECT * FROM users WHERE id = 1', 25);

      expect(mockLoggerInstance.debug).toHaveBeenCalledWith(
        '[Database] SELECT * FROM users WHERE id = 1 (25ms)',
      );
    });
  });

  describe('logAuthAttempt', () => {
    it('should log successful authentication attempt', () => {
      service.logAuthAttempt('user@example.com', true);

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        '[Auth] Login attempt for user@example.com - Success',
      );
    });

    it('should log failed authentication attempt', () => {
      service.logAuthAttempt('user@example.com', false);

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        '[Auth] Login attempt for user@example.com - Failed',
      );
    });
  });

  describe('logException', () => {
    it('should log exception with error message and stack trace', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n  at test.ts:1:1';

      service.setContext('TestContext');
      service.logException(error);

      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        '[Exception] Test error',
        error.stack,
        'TestContext',
      );
    });

    it('should log exception with custom context', () => {
      const error = new Error('Custom error');

      service.logException(error, 'CustomContext');

      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        '[Exception] Custom error',
        error.stack,
        'CustomContext',
      );
    });

    it('should use "Exception" as default context when none is set', () => {
      const error = new Error('Error without context');

      service.logException(error);

      expect(mockLoggerInstance.error).toHaveBeenCalledWith(
        '[Exception] Error without context',
        error.stack,
        'Exception',
      );
    });
  });
});
