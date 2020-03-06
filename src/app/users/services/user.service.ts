import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierService } from '../../services/notifier.service';

export interface CreateUserRequest {
  displayName: string;
  password: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${environment.baseUrl}/api/users`;
  usersSubject$ = new Subject<User[]>();

  constructor(private http: HttpClient,
              private notifierService: NotifierService,
              private loaderService: LoaderService) {
  }

  loadUsers() {
    this.loaderService.show();
    this.http.get<{ users: User[] }>(`${this.baseUrl}`).toPromise()
        .then(
          result => {
            this.usersSubject$.next(result.users);
            this.loaderService.hide();
          })
        .catch(this.handleError)
        .finally(() => this.loaderService.hide());
  }

  get users$(): Observable<User[]> {
    this.loaderService.show();
    return this.http.get<{ users: User[] }>(`${this.baseUrl}`).pipe(
      map(result => result.users),
      catchError(this.handleError),
      finalize(() => this.loaderService.hide())
    );
  }

  user$(id: string): Observable<User> {
    this.loaderService.show();
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
      map(result => {
        return result.user;
      }),
      catchError(this.handleError),
      finalize(() => this.loaderService.hide())
    );
  }

  create(user: CreateUserRequest) {
    this.loaderService.show();
    return this.http.post<{ user: User }>(`${this.baseUrl}`, user).pipe(
      map(result => result.user),
      catchError(this.handleError),
      finalize(() => this.loaderService.hide())
    );
  }

  edit(user: User): Observable<User> {
    this.loaderService.show();
    return this.http.patch<{ user: User }>(`${this.baseUrl}/${user.uid}`, user).pipe(
      map(result => result.user),
      catchError(this.handleError),
      finalize(() => this.loaderService.hide())
    );
  }

  delete(user: User) {
    this.loaderService.show();
    return this.http.delete(`${this.baseUrl}/${user.uid}`).pipe(
      catchError(this.handleError),
      finalize(() => this.loaderService.hide())
    );
  }

  handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      const msg = `Backend returned ${error.status}: ${error.error?.message || error.statusText}`;
      this.notifierService.error(msg);
    }
    return throwError('Server error; please try again later.');
  }
}
