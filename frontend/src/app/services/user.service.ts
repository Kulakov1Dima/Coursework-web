import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private loginSubject = new BehaviorSubject<string | null>(null);
  userId$: Observable<number | null> = this.userIdSubject.asObservable();
  login$: Observable<string | null> = this.loginSubject.asObservable();

  constructor(private http: HttpClient) {}

  setUser(userId: number, login: string) {
    this.userIdSubject.next(userId);
    this.loginSubject.next(login);
  }

  getUserId(): Observable<number | null> {
    return this.userId$;
  }

  getLogin(): Observable<string | null> {
    return this.login$;
  }

  // Запрос для получения userId по login
  getUserIdByLogin(login: string): Observable<number> {
    const url = `${environment.apiUrl}/users/login/${login}`;
    return this.http.get<any>(url).pipe(
      map(user => user.id)
    );
  }

  clearUser() {
    this.userIdSubject.next(null);
    this.loginSubject.next(null);
  }
}