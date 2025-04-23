import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface UserDTO {
  id: number;
  login: string;
  photo?: string;
  nickname?: string;
  name?: string;
  surname?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = new BehaviorSubject<{ id: number; login: string } | null>(null);
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private loginSubject = new BehaviorSubject<string | null>(null);

  userId$: Observable<number | null> = this.userIdSubject.asObservable();
  login$: Observable<string | null> = this.loginSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Регистрация пользователя
  register(user: { login: string; password: string; nickname?: string; name?: string; surname?: string; photo?: string }): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${environment.baseUrl}/api/auth/register`, user);
  }

  // Проверка аутентификации и получение данных текущего пользователя
  getCurrentUserInfo(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${environment.baseUrl}/api/users/me`);
  }

  // Новый метод для получения пользователя по логину
  getUserByLogin(login: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${environment.baseUrl}/api/users/login/${login}`);
  }

  // Получение списка всех пользователей
  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${environment.baseUrl}/api/users`);
  }

  // Установка текущего пользователя
  setUser(id: number, login: string) {
    this.currentUser.next({ id, login });
    this.userIdSubject.next(id);
    this.loginSubject.next(login);
  }

  // Получение текущего пользователя
  getCurrentUser(): Observable<{ id: number; login: string } | null> {
    return this.currentUser.asObservable();
  }

  // Получение ID текущего пользователя
  getUserId(): Observable<number | null> {
    return this.userId$;
  }

  // Получение логина текущего пользователя
  getLogin(): Observable<string | null> { 
    return this.login$;
  }

  // Очистка данных пользователя
  clearUser() {
    this.currentUser.next(null);
    this.userIdSubject.next(null);
    this.loginSubject.next(null);
  }
}