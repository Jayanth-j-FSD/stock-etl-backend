import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    errors?: any,
  ) {
    super(
      {
        statusCode,
        message,
        errors,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  static badRequest(message: string, errors?: any): AppException {
    return new AppException(message, HttpStatus.BAD_REQUEST, errors);
  }

  static unauthorized(message: string = 'Unauthorized'): AppException {
    return new AppException(message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Forbidden'): AppException {
    return new AppException(message, HttpStatus.FORBIDDEN);
  }

  static notFound(message: string): AppException {
    return new AppException(message, HttpStatus.NOT_FOUND);
  }

  static conflict(message: string): AppException {
    return new AppException(message, HttpStatus.CONFLICT);
  }

  static internalServerError(message: string = 'Internal server error'): AppException {
    return new AppException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
