import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chat } from '../repositories/chat.model';
import { Observable, of, Subscription, combineLatest } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import { User } from '../repositories/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  allUsers: (User & { isInChat?: boolean })[] = [];
  isLoading: boolean = false;
  isLoadingUsers: boolean = false;
  errorMessage: string | null = null;
  errorMessageUsers: string | null = null;
  isOwnProfile: boolean = false;
  isUsersPanelOpen: boolean = false;
  isAddingUsersMode: boolean = false;
  isCreatingChat: boolean = false;
  newChatName: string = '';
  newChatType: string = 'PUBLIC';
  private routerSubscription: Subscription = new Subscription();
  private dataSubscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeUsersPanel();
      });

    this.loadData();
  }

  private loadData() {
    this.dataSubscription.unsubscribe();
    this.dataSubscription = new Subscription();

    this.dataSubscription = combineLatest([
      this.userService.getUserId().pipe(take(1)),
      this.userService.getLogin().pipe(take(1)),
      this.route.paramMap.pipe(take(1))
    ])
      .pipe(
        switchMap(([currentUserId, currentUserLogin, params]) => {
          this.currentUserId = currentUserId;
          this.currentUserLogin = currentUserLogin;

          if (!currentUserId || !currentUserLogin) {
            this.errorMessage = 'Пользователь не авторизован';
            this.router.navigate(['/login']);
            return of(null);
          }

          const loginFromUrl = params.get('login');
          this.viewedUserLogin = loginFromUrl || currentUserLogin;
          this.isOwnProfile = this.viewedUserLogin === this.currentUserLogin;

          if (this.isOwnProfile) {
            return this.userService.getCurrentUserInfo().pipe(
              switchMap((user: User) => {
                this.viewedUserId = user.id;
                this.isLoading = true;
                return this.chatService.getChats(user.id);
              })
            );
          } else {
            return this.userService.getUserByLogin(this.viewedUserLogin!).pipe(
              switchMap((user: User) => {
                this.viewedUserId = user.id;
                this.isLoading = true;
                return this.chatService.getChats(user.id);
              })
            );
          }
        })
      )
      .subscribe({
        next: (chats) => {
          if (chats) {
            if (!this.isOwnProfile) {
              this.chats = chats.filter((chat: Chat) => chat.type === 'PUBLIC');
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
          if (err.status === 401) {
            this.userService.clearUser();
            this.router.navigate(['/login']);
          }
        }
      });
  }

  selectChat(chat: Chat) {
    if (!this.isOwnProfile) {
      return;
    }

    if (this.selectedChat?.id === chat.id && !this.isAddingUsersMode) {
      this.closeUsersPanel();
      return;
    }

    this.selectedChat = chat;
    this.isUsersPanelOpen = true;
    this.isLoadingUsers = true;
    this.errorMessageUsers = null;
    this.isAddingUsersMode = false;

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
    this.allUsers = [];
    this.isAddingUsersMode = false;
  }

  joinChat(chatId: number) {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      this.router.navigate([`/messenger/${chatId}`], {
        queryParams: { chatName: chat.name }
      });
    }
  }

  addUser() {
    this.isAddingUsersMode = true;
    this.isLoadingUsers = true;
    this.errorMessageUsers = null;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users
          .filter(user => user.id !== this.currentUserId)
          .map(user => ({
            ...user,
            isInChat: this.chatUsers.some(u => u.id === user.id)
          }));
        this.isLoadingUsers = false;
      },
      error: (err) => {
        this.errorMessageUsers = 'Ошибка при загрузке пользователей';
        console.error('All users error:', err);
        this.isLoadingUsers = false;
      }
    });
  }

  addUserToChat(userId: number) {
    if (!this.selectedChat) return;

    this.chatService.addUserToChat(this.selectedChat.id, userId).subscribe({
      next: () => {
        const user = this.allUsers.find(u => u.id === userId);
        if (user && !this.chatUsers.some(u => u.id === userId)) {
          this.chatUsers = [...this.chatUsers, user];
          this.allUsers = this.allUsers.map(u =>
            u.id === userId ? { ...u, isInChat: true } : u
          );
        }
      },
      error: (err) => {
        this.errorMessageUsers = 'Ошибка при добавлении пользователя';
        console.error('Add user error:', err);
      }
    });
  }

  removeUser(chatId: number, userId: number) {
    this.chatService.removeUserFromChat(chatId, userId).subscribe({
      next: () => {
        this.chatUsers = this.chatUsers.filter(user => user.id !== userId);
        this.allUsers = this.allUsers.map(user =>
          user.id === userId ? { ...user, isInChat: false } : user
        );
      },
      error: (err) => {
        this.errorMessageUsers = 'Ошибка при удалении пользователя';
        console.error('Remove user error:', err);
      }
    });
  }

  toggleUserInChat(userId: number) {
    const user = this.allUsers.find(u => u.id === userId);
    if (user?.isInChat) {
      this.removeUser(this.selectedChat!.id, userId);
    } else {
      this.addUserToChat(userId);
    }
  }

  goToUserProfile(login: string) {
    this.router.navigate([`/dashboard/${login}`]);
  }

  returnToChatUsers() {
    this.isAddingUsersMode = false;
    this.isLoadingUsers = true;
    this.errorMessageUsers = null;

    if (this.selectedChat) {
      this.chatService.getChatUsers(this.selectedChat.id).subscribe({
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
  }

  startNewChat() {
    this.isCreatingChat = true;
    this.newChatName = '';
    this.newChatType = 'PUBLIC';
  }

  createChat() {
    if (!this.currentUserId || !this.newChatName.trim()) {
      this.errorMessage = 'Название чата не может быть пустым';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.chatService.createChat(this.newChatName, this.newChatType, this.currentUserId).subscribe({
      next: (chat) => {
        this.chats = [...this.chats, chat];
        this.isCreatingChat = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при создании чата';
        console.error('Create chat error:', err);
        this.isLoading = false;
      }
    });
  }

  cancelCreateChat() {
    this.isCreatingChat = false;
    this.newChatName = '';
    this.newChatType = 'PUBLIC';
  }

  deleteChat(chatId: number) {
    if (confirm('Вы уверены, что хотите удалить этот чат?')) {
      this.isLoading = true;
      this.errorMessage = null;

      this.chatService.deleteChat(chatId).subscribe({
        next: () => {
          this.chats = this.chats.filter(chat => chat.id !== chatId);
          if (this.selectedChat?.id === chatId) {
            this.closeUsersPanel();
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Ошибка при удалении чата';
          console.error('Delete chat error:', err);
          this.isLoading = false;
        }
      });
    }
  }

  logout() {
    this.userService.clearUser(); // Очищаем данные пользователя
    this.router.navigate(['/login']); // Перенаправляем на страницу логина
  }

  trackByChatId(index: number, chat: Chat): number {
    return chat.id;
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}