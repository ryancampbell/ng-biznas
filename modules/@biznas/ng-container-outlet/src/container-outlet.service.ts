import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { AnonymousSubscription } from 'rxjs/Subscription';

import { BizContainerOutletContent } from './container-outlet-content';

import * as _ from 'lodash';

@Injectable()
export class BizContainerOutletService {

  public get contents$(): Observable<BizContainerOutletContent[]> { return this.contentsSubject.asObservable(); }

  private contentsSubject: ReplaySubject<BizContainerOutletContent[]> = new ReplaySubject<BizContainerOutletContent[]>();
  private contents: BizContainerOutletContent[] = [];
  private routeContents: BizContainerOutletContent[] = [];

  private subscriptions: AnonymousSubscription[] = [];

  constructor(
    private router: Router,
  ) {
    this.subscriptions.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onNavigationEnd();
      }
    }));
  }

  public hasContent(container: string): boolean {
    return !!this.contents.filter((c) => _.isEqual(c.container, container)).length;
  }

  public activate(content: BizContainerOutletContent): () => void {
    this.contents.push(content);
    this.contentsSubject.next(_.clone(this.contents));
    return () => { this.deactivate(content); };
  }

  private deactivate(content: BizContainerOutletContent): void {
    this.contents = this.contents.filter((e) => e !== content);
    this.contentsSubject.next(_.clone(this.contents));
  }

  private onNavigationEnd(): void {
    let newRouteContents: BizContainerOutletContent[] = [];
    this.resolveRouteContents(this.router.routerState.snapshot.root, newRouteContents);

    newRouteContents = _.uniqWith(newRouteContents, _.isEqual);

    const newContents = _.differenceWith(newRouteContents, this.routeContents, _.isEqual);
    const removedContents = _.differenceWith(this.routeContents, newRouteContents, _.isEqual);

    newContents.forEach((c) => this.activate(c));
    removedContents.forEach((c) => this.deactivate(c));

    this.routeContents = newRouteContents;
  }

  private resolveRouteContents(snapshot: ActivatedRouteSnapshot, routeContents: BizContainerOutletContent[]): void {
    if (snapshot.data && (snapshot.data as any).containers) {
      const containers: { [key: string]: BizContainerOutletContent } = (snapshot.data as any).containers;
      for (let key in containers) {
        if (containers.hasOwnProperty(key)) {
          routeContents.push(containers[key]);
        }
      }
    }
    for (let child of snapshot.children) {
      this.resolveRouteContents(child, routeContents);
    }
  }
}
