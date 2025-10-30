import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements LoggerService {
  private logger: Logger;
  private context?: string;

  constructor() {
    this.logger = new Logger();
  }

  setContext(context: string) {
    this.context = context;
    this.logger = new Logger(context);
  }

  log(message: any, context?: string) {
    const logContext = context || this.context;
    this.logger.log(message, logContext);
  }

  error(message: any, trace?: string, context?: string) {
    const logContext = context || this.context;
    this.logger.error(message, trace, logContext);
  }

  warn(message: any, context?: string) {
    const logContext = context || this.context;
    this.logger.warn(message, logContext);
  }

  debug(message: any, context?: string) {
    const logContext = context || this.context;
    this.logger.debug(message, logContext);
  }

  verbose(message: any, context?: string) {
    const logContext = context || this.context;
    this.logger.verbose(message, logContext);
  }

  // Custom methods for structured logging
  logRequest(method: string, url: string, userId?: string) {
    const message = `[Request] ${method} ${url}${userId ? ` - User: ${userId}` : ''}`;
    this.log(message);
  }

  logResponse(method: string, url: string, statusCode: number, duration: number) {
    const message = `[Response] ${method} ${url} - ${statusCode} (${duration}ms)`;
    this.log(message);
  }

  logDatabaseQuery(query: string, duration?: number) {
    const message = `[Database] ${query}${duration ? ` (${duration}ms)` : ''}`;
    this.debug(message);
  }

  logAuthAttempt(email: string, success: boolean) {
    const message = `[Auth] Login attempt for ${email} - ${success ? 'Success' : 'Failed'}`;
    this.log(message);
  }

  logException(error: Error, context?: string) {
    const logContext = context || this.context || 'Exception';
    this.error(`[Exception] ${error.message}`, error.stack, logContext);
  }
}
