import { BizConfig } from './src/biz/config';
import { BizServer } from './src/biz/server';

export function server(config?: BizConfig): BizServer {
  return new BizServer(config);
}
