import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException,
} from '@nestjs/common';
import {
 catchError, Observable, throwError, timeout, TimeoutError,
} from 'rxjs';

@Injectable()
export class MyTimeoutInterceptor implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();

      return next.handle()
        .pipe(
          timeout(5000),

          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
              return throwError(err);
          }),
        );
    }
}
