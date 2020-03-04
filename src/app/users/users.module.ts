import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users/users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserDialogComponent } from './user-form/user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { UserDeleteDialogComponent } from './user-delete-dialog/user-delete-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    UsersComponent,
    UserDialogComponent,
    UserDeleteDialogComponent
  ],
  entryComponents: [
    UserDialogComponent,
    UserDeleteDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    FlexModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class UsersModule { }
