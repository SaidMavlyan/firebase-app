import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsDailyListComponent } from './meals-daily-list.component';

describe('MealsDailyListComponent', () => {
  let component: MealsDailyListComponent;
  let fixture: ComponentFixture<MealsDailyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealsDailyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealsDailyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
