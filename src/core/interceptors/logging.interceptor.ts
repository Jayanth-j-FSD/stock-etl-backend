import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url, body, params, query } = request;
    const now = Date.now();

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url}
      Params: ${JSON.stringify(params)}
      Query: ${JSON.stringify(query)}
      Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          this.logger.log(`Outgoing Response: ${method} ${url} - ${responseTime}ms - Success`);
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Outgoing Response: ${method} ${url} - ${responseTime}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
