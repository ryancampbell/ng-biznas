import 'core-js/client/shim';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/zone';

// Angular 2
import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic, UniversalModule } from 'angular2-universal/browser';

import { BizConfig } from './config';

export class BizClient {

  // ========================================
  // constructor
  // ========================================

  public constructor(private config: BizConfig) {}

  // ========================================
  // public methods
  // ========================================

  public bootstrap(appModule?: any): BizClient {

    if (!appModule) {
      const rootKey = 'root';
      appModule = this.config.apps[rootKey];
    }

    if (process.env.ENV === 'production') {
      enableProdMode();
    }

    const platformRef = platformUniversalDynamic();

    document.addEventListener('DOMContentLoaded', () => {
      platformRef.bootstrapModule(appModule);
    });

    return this;
  }
}
