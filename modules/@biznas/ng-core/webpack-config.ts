import { BizConfig } from './src/biz/config';

export function webpackConfig( config: BizConfig ): any {
  return require('./src/webpack/webpack.dev');
}