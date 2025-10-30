import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        // Don't wrap the response if it's a 204 No Content
        if (response.statusCode === 204) {
          return data;
        }

        // Don't wrap if already wrapped
        if (data && typeof data === 'object' && 'statusCode' in data) {
          return data;
        }

        return {
          statusCode: response.statusCode,
          message: this.getSuccessMessage(request.method),
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private getSuccessMessage(method: string): string {
    switch (method) {
      case 'GET':
        return 'Data retrieved successfully';
      case 'POST':
        return 'Resource created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Operation successful';
    }
  }
}
