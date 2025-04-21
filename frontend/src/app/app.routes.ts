import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MessengerComponent } from './messenger/messenger.component';
import { LoginComponent } from './login/login.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';

// Функциональный охранник
const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUserId().pipe(
    map(userId => {
      if (userId) {
        return true; // Пользователь авторизован, доступ разрешён
      } else {
        router.navigate(['/login']);
        return false; // Пользователь не авторизован, перенаправляем на логин
      }
    })
  );
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/:login', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'messenger/:chatId', component: MessengerComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];