import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Meal } from '../models/meal';
import { map } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';
import { convertSnaps } from '../../services/utils';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  constructor(private db: AngularFirestore,
              private loaderService: LoaderService,
              private errorHandler: ErrorHandlerService) {
  }

  loadUserMeals(userId: string): Observable<Meal[]> {
    return this.db.collection('meals',
      ref => ref.where('userId', '==', userId))
               .snapshotChanges()
               .pipe(map(snaps => convertSnaps<Meal>(snaps)));
  }

  create(meal: Meal): Promise<void | Observable<never>> {
    this.loaderService.show();
    return this.db.collection('/meals').add(meal)
               .then(() => {
               })
               .catch(this.errorHandler.onHttpError)
               .finally(() => {
                 this.loaderService.hide();
               });
  }

  update(mealId: string, meal: Partial<Meal>): Promise<void | Observable<never>> {
    this.loaderService.show();
    return this.db.doc(`/meals/${mealId}`).update(meal)
               .catch(this.errorHandler.onHttpError)
               .finally(() => {
                 this.loaderService.hide();
               });
  }

  delete(meal: Meal): Promise<void | Observable<never>> {
    this.loaderService.show();
    return this.db.doc(`/meals/${meal.id}`).delete()
               .catch(this.errorHandler.onHttpError)
               .finally(() => {
                 this.loaderService.hide();
               });
  }
}
