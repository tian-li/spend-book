import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { fromUI } from '@spend-book/core/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  themeName: string;
  loading: boolean;

  private unsubscribe$ = new Subject();

  constructor(private store: Store, private overlayContainer: OverlayContainer,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/github.svg')
    );
  }

  ngOnInit() {
    this.store.pipe(
      select(fromUI.selectThemeName),
      takeUntil(this.unsubscribe$)
    ).subscribe((themeName) => {
      this.themeName = themeName;
      const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(themeName);
    });

    this.store.pipe(
      select(fromUI.selectLoading),
      debounceTime(200),
    takeUntil(this.unsubscribe$)
    ).subscribe((loading: boolean) => this.loading = loading);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
