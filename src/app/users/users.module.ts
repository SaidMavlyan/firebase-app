import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users/users.component';
import { UserDialogComponent } from './user-form/user-dialog.component';
import { UserDeleteDialogComponent } from './user-delete-dialog/user-delete-dialog.component';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
    UsersRoutingModule,
  ]
})
export class UsersModule { }
