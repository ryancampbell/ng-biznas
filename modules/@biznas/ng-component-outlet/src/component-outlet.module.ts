import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule } from '@angular/core';

import { BizComponentOutletDirective } from './component-outlet.directive';

@NgModule({
  declarations: [ BizComponentOutletDirective ],
  exports: [ BizComponentOutletDirective ],
})
export class BizComponentOutletModule {
  static withEntryComponents(...components: any[]): ModuleWithProviders {
    return {
      ngModule: BizComponentOutletModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true },
      ],
    };
  }
}
