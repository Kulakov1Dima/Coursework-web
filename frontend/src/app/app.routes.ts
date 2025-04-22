import { DashboardComponent } from './dashboard/dashboard.component';
import { MessengerComponent } from './messenger/messenger.component';
import { LoginComponent } from './login/login.component';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';

const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUserId().pipe(
    map(userId => {
      if (userId) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
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