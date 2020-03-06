import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealDeleteDialogComponent } from './meal-delete-dialog.component';

describe('MealDeleteDialogComponent', () => {
  let component: MealDeleteDialogComponent;
  let fixture: ComponentFixture<MealDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
