import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MealInfoService {

  constructor(private db: AngularFirestore) {
  }

  addMeal(changes: any): Observable<any> {
    return from(this.db.collection('/meal-info').add(changes));
  }
}
