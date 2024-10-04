import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body } = request;
    const userAgent = headers['user-agent'] || 'Unknown';

    // Log the incoming request
    this.logger.log(
      `Incoming Request - Method: ${method}, URL: ${url}, User Agent: ${userAgent}`
    );

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          // Log the outgoing response
          this.logger.log(
            `Outgoing Response - Method: ${method}, URL: ${url}, Status Code: ${statusCode}, Response Time: ${responseTime}ms`
          );

          // Log detailed request and response information for debugging (consider removing in production)
          this.logger.debug(`Request Headers: ${JSON.stringify(headers)}`);
          this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
          this.logger.debug(`Response Body: ${JSON.stringify(data)}`);
        },
        error: (error: any) => {
          const responseTime = Date.now() - now;

          // Log errors
          this.logger.error(
            `Request Error - Method: ${method}, URL: ${url}, Error: ${error.message}, Response Time: ${responseTime}ms`,
            error.stack
          );
        },
      })
    );
  }
}