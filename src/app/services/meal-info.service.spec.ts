import { TestBed } from '@angular/core/testing';

import { MealInfoService } from './meal-info.service';

describe('MealInfoService', () => {
  let service: MealInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
