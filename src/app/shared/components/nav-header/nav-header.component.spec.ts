import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavHeaderComponent } from './list-header.component';

describe('ListHeaderComponent', () => {
  let component: NavHeaderComponent;
  let fixture: ComponentFixture<NavHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
