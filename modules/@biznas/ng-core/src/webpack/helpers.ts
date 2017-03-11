/**
 * @author: @AngularClass
 */
import * as path from 'path';

export class WebpackHelper {
  public static instance: WebpackHelper;

  public ROOT: string = path.resolve(process.cwd());

  static getInstance(): WebpackHelper {
    WebpackHelper.instance = WebpackHelper.instance || new WebpackHelper();
    return WebpackHelper.instance;
  }

  public constructor() {
    if (WebpackHelper.instance) {
      throw new Error('Error - use WebpackHelper.getInstance()');
    }
  }

  public hasProcessFlag(flag: any): boolean {
    return process.argv.join('').indexOf(flag) > -1;
  }

  public isWebpackDevServer(): boolean {
    return process.argv[1] && !! (/webpack-dev-server$/.exec(process.argv[1]));
  }

  public root(args: any): string {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [ this.ROOT ].concat(args));
  }

  public checkNodeImport(context: any, request: any, callback: Function): void {
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
      callback(null, 'commonjs ' + request);
      return;
    }
    callback();
  }
}
