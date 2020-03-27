import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { catchError, finalize, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private currentUserId$ = new BehaviorSubject<string>(null);
  currentUser$ = new BehaviorSubject<User>(null);
  usersSubject$ = new BehaviorSubject<User[]>(null);

  constructor(private http: HttpClient,
              private afAuth: AngularFireAuth,
              private errorHandler: ErrorHandlerService,
              private loaderService: LoaderService) {
    this.afAuth.user.subscribe((user) => {
      this.currentUserId$.next(user?.uid || null);
    });

    this.currentUserId$.subscribe(userId => {
      if (userId) {
        this.getUser(userId).subscribe(currentUser => {
          this.currentUser$.next(currentUser);
        });
      } else {
        this.currentUser$.next(null);
      }
    });
  }

  reloadCurrentUser() {
    this.currentUserId$.next(this.currentUserId$.value);
  }

  loadUsers() {
    this.loaderService.show();
    this.http.get<{ users: User[] }>(`${this.baseUrl}`)
        .pipe(
          map(result => this.usersSubject$.next(result.users)),
          catchError(this.errorHandler.onHttpError),
          finalize(() => this.loaderService.hide())
        ).subscribe();
  }

  getUser(id: string): Observable<User> {
    this.loaderService.show();
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`)
               .pipe(
                 map(result => result.user),
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

