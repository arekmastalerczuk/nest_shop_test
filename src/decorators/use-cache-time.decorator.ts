import { SetMetadata } from '@nestjs/common';

export const UseCacheTime = (cacheTimeInSeconds: number) => SetMetadata('cacheTimeInSeconds', cacheTimeInSeconds);
