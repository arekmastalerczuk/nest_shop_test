import * as crypto from 'crypto';
import { authConfig } from '../config/auth-config';

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac('sha512', authConfig.salt);
  hmac.update(p);

  return hmac.digest('hex');
};
