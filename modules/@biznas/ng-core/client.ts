import { BizClient } from './src/biz/client';
import { BizConfig } from './src/biz/config';

export function client(config?: BizConfig): BizClient {
  return new BizClient(config);
}
