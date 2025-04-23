import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserDTO } from './user.service';
import { BasicAuthInterceptor } from '../interceptors/basic-auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}/api/users`;

  constructor(
    private http: HttpClient,
    private authInterceptor: BasicAuthInterceptor
  ) {}

  login(username: string, password: string): Observable<UserDTO> {
    // Сохраняем учетные данные в интерцепторе
    this.authInterceptor.setCredentials(username, password);
    // Проверяем аутентификацию через защищенный эндпоинт
    return this.http.get<UserDTO>(`${this.apiUrl}/me`);
  }

  logout() {
    // Очищаем учетные данные
    this.authInterceptor.clearCredentials();
  }
}