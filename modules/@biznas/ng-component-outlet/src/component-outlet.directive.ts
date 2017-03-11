import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EventEmitter,
  Injector,
  Input,
  NgModuleFactory,
  NgModuleRef,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';

import { AnonymousSubscription } from 'rxjs/Subscription';

import { BizComponentOutlet } from './component-outlet';

import * as _ from 'lodash';

@Directive({
  selector: '[bizComponentOutlet]',
})
export class BizComponentOutletDirective implements OnChanges, OnDestroy, BizComponentOutlet {
  @Input() bizComponentOutlet: Type<any>;
  @Input() injector: Injector;
  @Input() content: any[][];
  @Input() ngModuleFactory: NgModuleFactory<any>;

  @Output() onComponent: EventEmitter<ComponentRef<any>> = new EventEmitter<ComponentRef<any>>();

  private _componentRef: ComponentRef<any>;
  private _moduleRef: NgModuleRef<any>;

  constructor(
    private _view: ViewContainerRef,
  ) {}

  isActivated(): boolean { return !!this._componentRef; }

  ngOnChanges(changes: SimpleChanges): void {
    let activate = false;
    if ((changes as any).ngModuleFactory) {
      if (this._moduleRef) { this._moduleRef.destroy(); }
      if (this.ngModuleFactory) {
        const injector = this.injector || this._view.parentInjector;
        this._moduleRef = this.ngModuleFactory.create(injector);
      } else {
        this._moduleRef = undefined;
      }
      activate = true;
    }

    if ((changes as any).bizComponentOutlet.currentValue !== (changes as any).bizComponentOutlet.previousValue) {
      activate = true;
    }

    if (activate) {
      this.activate(this.bizComponentOutlet);
    }
  }

  ngOnDestroy(): void {
    this.deactivate();
    if (this._moduleRef) { this._moduleRef.destroy(); }
  }

  private activate(component: Type<any>): void {
    this.deactivate();

    if (!component) {
      return;
    }

    try {
      const injector = this.injector || this._view.parentInjector;
      const factory = injector.get(ComponentFactoryResolver).resolveComponentFactory(component);
      this._componentRef = this._view.createComponent(factory, this._view.length, injector, this.content);
      this.onComponent.emit(this._componentRef);
      try {
        this._componentRef.changeDetectorRef.detectChanges();
      } catch (e) {
        console.error(`detectChanges failed on activated component in BizComponentOutlet`, { e, component });
        return;
      }
    } catch (e) {
      console.error(`Failed to activate component in BizComponentOutlet`, { e, component });
      return;
    }
  }

  private deactivate(): void {
    if (this._componentRef) {
      this._view.remove(this._view.indexOf(this._componentRef.hostView));
      this._componentRef.destroy();
    }
    this._view.clear();
    this._componentRef = undefined;
  }
}
