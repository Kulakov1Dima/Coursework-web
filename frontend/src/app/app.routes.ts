import { DashboardComponent } from './dashboard/dashboard.component';
import { MessengerComponent } from './messenger/messenger.component';
import { LoginComponent } from './login/login.component';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { Observable, of } from 'rxjs';

const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUrl = router.url;

  return userService.getUserId().pipe(
    take(1),
    switchMap(userId => {
      if (userId) {
        console.log('User is authenticated, allowing access to:', currentUrl);
        return of(true);
      }

      console.log('No userId found, attempting to restore user state...');
      return userService.getCurrentUserInfo().pipe(
        map(user => {
          if (user) {
            console.log('User restored successfully, allowing access to:', currentUrl);
            return true;
          } else {
            console.log('User not authenticated, redirecting to /login');
            router.navigate(['/login']);
            return false;
          }
        }),
        catchError(err => {
          console.error('Error restoring user state:', err);
          router.navigate(['/login']);
          return of(false);
        })
      );
    })
  );
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/:login', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'messenger/:chatId', component: MessengerComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];