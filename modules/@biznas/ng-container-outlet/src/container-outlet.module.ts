import { ANALYZE_FOR_ENTRY_COMPONENTS, ModuleWithProviders, NgModule } from '@angular/core';

import { BizContainerOutletDirective } from './container-outlet.directive';
import { BizContainerOutletService } from './container-outlet.service';

@NgModule({
  declarations: [ BizContainerOutletDirective ],
  exports: [ BizContainerOutletDirective ],
})
export class BizContainerOutletModule {
  static withEntryComponents(...components: any[]): ModuleWithProviders {
    return {
      ngModule: BizContainerOutletModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: components, multi: true },
      ],
    };
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BizContainerOutletModule,
      providers: [ BizContainerOutletService ],
    };
  }
}
