import { ComponentFactoryResolver, Injectable, Injector, Type } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, UrlSegment } from '@angular/router';

import { BizContainerOutletContent } from './container-outlet-content';

import * as _ from 'lodash';

@Injectable()
export class BizContainerOutletResolver implements Resolve<{ [key: string]: BizContainerOutletContent }> {

  constructor(
    private containers: { [key: string]: Type<any> },
    private injector: Injector,
  ) {}

  /**
   * Resolve hook.
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { [key: string]: BizContainerOutletContent } {
    let result: { [key: string]: BizContainerOutletContent } = {};
    for (let key in this.containers) {
      if (this.containers.hasOwnProperty(key)) {
        result[key] = {
          container: key,
          component: this.containers[key],
          injector: this.injector,
        };
      }
    }
    return result;
  }
}
