import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditMealComponent } from '../add-edit-meal/add-edit-meal.component';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent {

  constructor(private db: AngularFirestore, private dialog: MatDialog) {
    this.db.collection('meal-info').valueChanges().subscribe(items => {
      console.log('>>>>items', items);
    });
  }

  addEntry() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';

    this.dialog.open(AddEditMealComponent, dialogConfig)
        .afterClosed()
        .subscribe((val) => {
          console.log('added');
          // if (val) {
          //   this.courseEdited.emit();
          // }
        });
  }
}
