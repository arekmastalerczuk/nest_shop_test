import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import {
  Observable, of, tap,
} from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CacheItem } from '../cache/cache-item.entity';

@Injectable()
export class MyCacheInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
  ) {
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const method = context.getHandler();
    const controllerName = context.getClass().name;
    const actionName = method.name;

    const cacheTimeInSeconds = this.reflector.get<number>('cacheTimeInSeconds', method);
    const cachedData = await CacheItem.findOne({
      where: {
        controllerName,
        actionName,
      },
    });

    // const cachedTime = this.reflector.get<Date>('cacheTime', method);

    if (cachedData) {
      if (+cachedData.createdAt + cacheTimeInSeconds * 1000 > +new Date()) {
        console.log('Using cached data.');
        return of(JSON.parse(cachedData.dataJson));
      }
        console.log('Removing cached data: ', cachedData.id);
        await cachedData.remove();
    }

    console.log('Generating live data.');
    return next.handle()
      .pipe(
        tap(async (data) => {
          const newCachedData = new CacheItem();
          newCachedData.controllerName = controllerName;
          newCachedData.actionName = actionName;
          newCachedData.dataJson = JSON.stringify(data);

          await newCachedData.save();
        }),
      );
  }
}
