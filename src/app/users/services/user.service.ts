import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient,
              private loaderService: LoaderService) {
  }

  get users$(): Observable<User[]> {
    this.loaderService.show();
    return this.http.get<{ users: User[] }>(`${this.baseUrl}`).pipe(
      map(result => result.users),
      finalize(() => this.loaderService.hide())
    );
  }

  user$(id: string): Observable<User> {
    this.loaderService.show();
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
      map(result => {
        return result.user;
      }),
      finalize(() => this.loaderService.hide())
    );
  }

  create(user: CreateUserRequest) {
    this.loaderService.show();
    return this.http.post(`${this.baseUrl}`, user).pipe(
      map(() => {
      }),
      finalize(() => this.loaderService.hide())
    );
  }

  edit(user: User): Observable<User> {
    this.loaderService.show();
    return this.http.patch<{ user: User }>(`${this.baseUrl}/${user.uid}`, user).pipe(
      map(result => result.user),
      finalize(() => this.loaderService.hide())
    );
  }
}
