import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { clearCredentials, setCredentials } from '../interceptors/basic-auth.interceptor';
import { environment } from '../environments/environment';
import { User } from '../repositories/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}/users`;
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
    console.log('Sending login request with Authorization:', authHeader);
    return this.http.get<User>(`${this.apiUrl}/me`, {
      headers: { Authorization: authHeader }
    }).pipe(
      tap((user) => {
        console.log('Login successful, setting credentials for:', username);
        setCredentials(username, password);
      })
    );
  }

  logout() {
    clearCredentials();
  }
}