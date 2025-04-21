import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Chat } from '../repositories/chat.model';
import { User } from '../repositories/user.model';
import { Observable, switchMap, of, combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUserId: number | null = null;
  currentUserLogin: string | null = null;
  viewedUserId: number | null = null;
  viewedUserLogin: string | null = null;
  chats: Chat[] = [];
  selectedChat: Chat | null = null;
  chatUsers: User[] = [];
  isLoading: boolean = false;
  isLoadingUsers: boolean = false;
  errorMessage: string | null = null;
  errorMessageUsers: string | null = null;
  isOwnProfile: boolean = false;
  isUsersPanelOpen: boolean = false;
  private routerSubscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Подписываемся на события навигации, чтобы закрывать панель пользователей при смене страницы
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeUsersPanel(); // Закрываем панель при переходе на другую страницу
      });

    combineLatest([
      this.userService.getUserId(),
      this.userService.getLogin(),
      this.route.paramMap
    ])
      .pipe(
        switchMap(([currentUserId, currentUserLogin, params]) => {
          this.currentUserId = currentUserId;
          this.currentUserLogin = currentUserLogin;

          if (!currentUserId || !currentUserLogin) {
            this.errorMessage = 'Пользователь не авторизован';
            return of(null);
          }

          const loginFromUrl = params.get('login');
          this.viewedUserLogin = loginFromUrl || currentUserLogin;

          this.isOwnProfile = this.viewedUserLogin === this.currentUserLogin;

          return this.userService.getUserIdByLogin(this.viewedUserLogin).pipe(
            switchMap(viewedUserId => {
              this.viewedUserId = viewedUserId;
              this.isLoading = true;
              return this.chatService.getChats(viewedUserId);
            })
          );
        })
      )
      .subscribe({
        next: (chats) => {
          if (chats) {
            if (!this.isOwnProfile) {
              this.chats = chats.filter(chat => chat.type === 'PUBLIC');
            } else {
              this.chats = chats;
            }
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Ошибка при загрузке чатов';
          console.error('Chats error:', err);
          this.isLoading = false;
        }
      });
  }

  selectChat(chat: Chat) {
    // Открываем панель пользователей только на своей странице
    if (!this.isOwnProfile) {
      return;
    }

    if (this.selectedChat?.id === chat.id) {
      this.closeUsersPanel();
      return;
    }

    this.selectedChat = chat;
    this.isUsersPanelOpen = true;
    this.isLoadingUsers = true;
    this.errorMessageUsers = null;

    this.chatService.getChatUsers(chat.id).subscribe({
      next: (users) => {
        this.chatUsers = users.filter(user => user.id !== this.currentUserId);
        this.isLoadingUsers = false;
      },
      error: (err) => {
        this.errorMessageUsers = 'Ошибка при загрузке пользователей';
        console.error('Users error:', err);
        this.isLoadingUsers = false;
      }
    });
  }

  closeUsersPanel() {
    this.isUsersPanelOpen = false;
    this.selectedChat = null;
    this.chatUsers = [];
  }

  joinChat(chatId: number) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      this.router.navigate([`/messenger/${chatId}`], {
        queryParams: { chatName: chat.name }
      });
    }
  }

  removeUser(chatId: number, userId: number) {
    this.chatService.removeUserFromChat(chatId, userId).subscribe({
      next: () => {
        this.chatUsers = this.chatUsers.filter(user => user.id !== userId);
      },
      error: (err) => {
        this.errorMessageUsers = 'Ошибка при удалении пользователя';
        console.error('Remove user error:', err);
      }
    });
  }

  goToUserProfile(login: string) {
    this.router.navigate([`/dashboard/${login}`]);
  }

  addUser() {
    console.log('Add user to chat:', this.selectedChat?.id);
  }

  ngOnDestroy() {
    // Отписываемся от событий навигации
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}