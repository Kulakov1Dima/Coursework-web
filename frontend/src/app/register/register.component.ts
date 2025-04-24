import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Импортируем для реактивных форм
import { UserService} from '../services/user.service';
import { Router } from '@angular/router';
import { setCredentials } from '../interceptors/basic-auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../repositories/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  user = { login: '', password: '', nickname: '', name: '', surname: '', photo: '' };
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
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

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    this.user = this.registerForm.value;

    this.userService.register(this.user).subscribe({
      next: (registeredUser: User) => {
        console.log('User registered:', registeredUser);
        setCredentials(this.user.login, this.user.password);
        this.userService.setUser(registeredUser.id, registeredUser.login);
        this.userService.getCurrentUserInfo().subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Error fetching user info after registration:', err);
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при регистрации';
        console.error('Registration error:', err);
        this.isLoading = false;
      }
    });
  }
}