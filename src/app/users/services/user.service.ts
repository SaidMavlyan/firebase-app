import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { catchError, finalize, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AngularFireAuth } from '@angular/fire/auth';

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
  currentUser$ = new BehaviorSubject<User>(null);
  currentUserId = null;

  constructor(private http: HttpClient,
              private afAuth: AngularFireAuth,
              private errorHandler: ErrorHandlerService,
              private loaderService: LoaderService) {
    this.afAuth.user.subscribe((user) => {
      this.currentUserId = user ? user.uid : null;
      this.reloadCurrentUser();
    });
  }

  reloadCurrentUser() {
    if (this.currentUserId) {
      this.getUser(this.currentUserId).toPromise().then(currentUser => {
        this.currentUser$.next(currentUser);
      });
    } else {
      this.currentUser$.next(null);
    }
  }

  loadUsers() {
    this.loaderService.show();
    this.http.get<{ users: User[] }>(`${this.baseUrl}`).toPromise()
        .then(
          result => {
            this.usersSubject$.next(result.users);
          })
        .catch(this.errorHandler.onHttpError)
        .finally(() => this.loaderService.hide());
  }

  getUser(id: string): Observable<User> {
    this.loaderService.show();
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
      map(result => {
        return result.user;
      }),
      catchError(this.errorHandler.onHttpError),
      finalize(() => this.loaderService.hide())
    );
  }

  create(user: CreateUserRequest) {
    this.loaderService.show();
    return this.http.post<{ user: User }>(`${this.baseUrl}`, user).pipe(
      map(result => result.user),
      catchError(this.errorHandler.onHttpError),
      finalize(() => this.loaderService.hide())
    );
  }

  edit(user: User): Observable<User> {
    this.loaderService.show();
    return this.http.patch<{ user: User }>(`${this.baseUrl}/${user.uid}`, user).pipe(
      map(result => result.user),
      catchError(this.errorHandler.onHttpError),
      finalize(() => this.loaderService.hide())
    );
  }

  delete(user: User) {
    this.loaderService.show();
    return this.http.delete(`${this.baseUrl}/${user.uid}`).pipe(
      catchError(this.errorHandler.onHttpError),
      finalize(() => this.loaderService.hide())
    );
  }

}
