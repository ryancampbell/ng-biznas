import { ComponentFactoryResolver, Injector, Type, ViewContainerRef } from '@angular/core';

export interface BizContainerOutletContent {
  /**
   * The name of the container to display this content in.
   */
  container: string;

  /**
   * The content component.
   */
  component: Type<any>;

  /**
   * Injector to use for this content component.
   * If not set then container-outlet Injector is used.
   */
  injector?: Injector;
}
