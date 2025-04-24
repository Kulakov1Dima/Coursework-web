import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { clearCredentials } from '../interceptors/basic-auth.interceptor';
import { User } from '../repositories/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private loginSubject = new BehaviorSubject<string | null>(null);

  userId$: Observable<number | null> = this.userIdSubject.asObservable();
  login$: Observable<string | null> = this.loginSubject.asObservable();
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreUserState();
  }

  private restoreUserState(): void {
    const savedUserId = localStorage.getItem('userId');
    const savedLogin = localStorage.getItem('login');

    if (savedUserId && savedLogin) {
      console.log('Restoring user state from localStorage:', savedUserId, savedLogin);
      this.setUser(Number(savedUserId), savedLogin);

      this.getCurrentUserInfo().subscribe({
        error: (err) => {
          console.error('Failed to validate user on restore:', err);
          this.clearUser();
        }
      });
    }
  }

  register(user: { login: string; password: string; nickname?: string; name?: string; surname?: string; photo?: string }): Observable<User> {
    console.log('Registering user:', user.login);
    return this.http.post<User>(`${environment.baseUrl}/auth/register`, user).pipe(
      tap((registeredUser) => {
        console.log('User registered successfully:', registeredUser);
      }),
      catchError((err) => {
        console.error('Error registering user:', err);
        throw err;
      })
    );
  }

  getCurrentUserInfo(): Observable<User> {
    const cachedUser = this.currentUserSubject.getValue();
    if (cachedUser) {
      console.log('Returning cached current user:', cachedUser);
      return of(cachedUser);
    }

    console.log('Fetching current user info from:', `${environment.baseUrl}/users/me`);
    return this.http.get<User>(`${environment.baseUrl}/users/me`).pipe(
      tap((user) => {
        console.log('Current user info fetched:', user);
        this.currentUserSubject.next(user);
        this.setUser(user.id, user.login);
      }),
      catchError((err) => {
        console.error('Error fetching current user info:', err);
        this.clearUser();
        throw err;
      })
    );
  }

  getUserByLogin(login: string): Observable<User> {
    console.log('Fetching user by login:', login);
    return this.http.get<User>(`${environment.baseUrl}/users/login/${login}`).pipe(
      tap((user) => {
        console.log('User fetched by login:', user);
      }),
      catchError((err) => {
        console.error('Error fetching user by login:', err);
        throw err;
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    console.log('Fetching all users...');
    return this.http.get<User[]>(`${environment.baseUrl}/users`).pipe(
      tap((users) => {
        console.log('All users fetched:', users);
      }),
      catchError((err) => {
        console.error('Error fetching all users:', err);
        throw err;
      })
    );
  }

  setUser(id: number, login: string) {
    console.log('Setting current user - ID:', id, 'Login:', login);
    this.userIdSubject.next(id);
    this.loginSubject.next(login);
    const currentUser = this.currentUserSubject.getValue();
    if (currentUser) {
      this.currentUserSubject.next({ ...currentUser, id, login });
    }
    // Сохраняем userId и login в localStorage
    localStorage.setItem('userId', id.toString());
    localStorage.setItem('login', login);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getUserId(): Observable<number | null> {
    return this.userId$;
  }

  getLogin(): Observable<string | null> {
    return this.login$;
  }

  clearUser() {
    console.log('Clearing user data...');
    this.currentUserSubject.next(null);
    this.userIdSubject.next(null);
    this.loginSubject.next(null);
    clearCredentials();

    localStorage.removeItem('userId');
    localStorage.removeItem('login');
  }
}