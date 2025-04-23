import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { BasicAuthInterceptor } from '../interceptors/basic-auth.interceptor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private authInterceptor: BasicAuthInterceptor,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      nickname: [''],
      name: [''],
      surname: [''],
      photo: ['']
    });
  }

  ngOnInit() {
    // Проверяем, если пользователь уже аутентифицирован, перенаправляем на dashboard
    const savedLogin = localStorage.getItem('login');
    if (savedLogin) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const userData = this.registerForm.value;
    this.userService.register(userData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authInterceptor.setCredentials(userData.login, userData.password);
        this.userService.setUser(res.id, res.login);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 400) {
          this.errorMessage = 'Invalid registration data';
        } else if (err.status === 409) {
          this.errorMessage = 'Login already exists';
        } else {
          this.errorMessage = 'Registration failed';
        }
        console.error('Registration error:', err);
      }
    });
  }
}