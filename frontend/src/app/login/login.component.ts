import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Проверка, если пользователь уже аутентифицирован
    const savedLogin = localStorage.getItem('login');
    if (savedLogin) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Пожалуйста, заполните форму корректно';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    console.log('Attempting login for:', email);

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        this.userService.setUser(response.id, response.login);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        if (err.status === 401) {
          this.errorMessage = 'Неверный логин или пароль';
        } else {
          this.errorMessage = err.error?.message || 'Ошибка входа. Попробуйте снова.';
        }
        // Очищаем учетные данные при ошибке
        this.authService.logout();
      }
    });
  }
}