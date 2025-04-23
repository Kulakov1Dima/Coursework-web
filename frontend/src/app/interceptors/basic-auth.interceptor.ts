import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  private login: string | null = null;
  private password: string | null = null;

  setCredentials(login: string, password: string) {
    this.login = login;
    this.password = password;
    localStorage.setItem('login', login);
    localStorage.setItem('password', password);
    console.log('Credentials set:', login);
  }

  clearCredentials() {
    this.login = null;
    this.password = null;
    localStorage.removeItem('login');
    localStorage.removeItem('password');
    console.log('Credentials cleared');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.login || !this.password) {
      const savedLogin = localStorage.getItem('login');
      const savedPassword = localStorage.getItem('password');
      if (savedLogin && savedPassword) {
        this.login = savedLogin;
        this.password = savedPassword;
        console.log('Loaded credentials from localStorage:', this.login);
      }
    }

    if (this.login && this.password && !req.url.includes('/api/auth/register')) {
      console.log('Adding Authorization header for:', req.url);
      const authHeader = 'Basic ' + btoa(`${this.login}:${this.password}`);
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authHeader)
      });
      return next.handle(authReq);
    }
    console.log('No Authorization header added for:', req.url);
    return next.handle(req);
  }
}