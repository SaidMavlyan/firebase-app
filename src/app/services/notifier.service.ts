import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const ERROR_DURATION = 7000;

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) {
  }

  error(foo: string) {
    this.snackBar.open(foo, 'Error', {duration: ERROR_DURATION});
  }
}
