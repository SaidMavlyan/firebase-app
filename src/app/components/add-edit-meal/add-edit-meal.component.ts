import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MealInfoService } from '../../services/meal-info.service';

@Component({
  selector: 'app-add-edit-meal',
  templateUrl: './add-edit-meal.component.html',
  styleUrls: ['./add-edit-meal.component.scss']
})
export class AddEditMealComponent implements OnInit {

  form: FormGroup;
  description: string;

  constructor(private fb: FormBuilder,
              private mealInfoService: MealInfoService,
              private dialogRef: MatDialogRef<AddEditMealComponent>) {
    this.form = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      // image: [new Date(), Validators.required]
      // date: [new Date(), Validators.required]
      // time: [new Date(), Validators.required]
      // calories: [120, Validators.pattern]
    });
  }

  ngOnInit() {
  }

  save() {
    const changes = this.form.value;

    this.mealInfoService.addMeal(changes)
        .subscribe(() => {
          this.dialogRef.close(this.form.value);
        });
  }

  close() {
    this.dialogRef.close();
  }
}
