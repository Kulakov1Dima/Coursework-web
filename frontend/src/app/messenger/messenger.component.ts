import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemService } from '../services/item.service';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import { Chat } from '../repositories/chat.model';

interface ItemDTO {
  id: number;
  chat: any;
  user: { id: number; login: string; photo: string; nickname: string; surname: string; name: string };
  type: 'MESSAGE' | 'POST';
  date: string;
  message: { id: number; messageText: string; item: any } | null;
  post: { id: number; messageText: string; item: any; comments: CommentDTO[] } | null;
}

interface CommentDTO {
  id: number;
  post: any;
  user: { id: number; login: string; photo: string; nickname: string; surname: string; name: string };
  textContent: string;
}

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit, OnDestroy {
  chatId: number | null = null;
  chatName: string | null = null;
  currentUserId: number | null = null;
  chatItems: ItemDTO[] = [];
  newMessage: string = '';
  newPost: string = '';
  errorMessage: string | null = null;
  isLoading = false;
  isPrivateChat = false;

  @ViewChild('chatContainer') private chatItemsContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private userService: UserService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatId = Number(this.route.snapshot.paramMap.get('chatId'));
    this.chatName = this.route.snapshot.queryParamMap.get('chatName') || 'Чат';

    this.userService.getUserId().subscribe({
      next: (userId) => {
        this.currentUserId = userId;
        if (!this.currentUserId) {
          this.errorMessage = 'Пользователь не авторизован';
          this.router.navigate(['/login']);
          return;
        }

        this.loadChatInfo();
        this.loadChatItems();

        this.itemService.connectWebSocket(this.chatId!, (newItem) => {
          if (newItem.type === 'POST' && this.isPrivateChat) return;
          this.chatItems = [...this.chatItems, newItem].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA === dateB ? a.id - b.id : dateA - dateB;
          });
          setTimeout(() => {
            if (this.isUserAtBottom() || newItem.user.id === this.currentUserId) {
              this.scrollToBottom();
            }
          }, 0);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Ошибка получения данных пользователя';
        this.router.navigate(['/login']);
      }
    });
  }

  loadChatInfo() {
    if (!this.chatId) return;
    this.chatService.getChat(this.chatId).subscribe({
      next: (chat: Chat) => {
        this.isPrivateChat = chat.type === 'PRIVATE';
        this.chatName = chat.name || this.chatName;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message || 'Ошибка загрузки информации о чате';
      }
    });
  }

  loadChatItems() {
    if (!this.chatId) {
      this.errorMessage = 'Чат не найден';
      return;
    }
    this.isLoading = true;
    this.itemService.getChatItems(this.chatId).subscribe({
      next: (items) => {
        this.chatItems = items
          .filter(item => !this.isPrivateChat || item.type !== 'POST')
          .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA === dateB ? a.id - b.id : dateA - dateB;
          });
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message || 'Ошибка загрузки сообщений';
        this.isLoading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.chatId || !this.currentUserId) {
      this.errorMessage = 'Сообщение не может быть пустым';
      return;
    }
  
    this.isLoading = true;
    this.itemService.sendMessage(this.chatId, this.currentUserId, this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        this.isLoading = false;
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message || 'Ошибка отправки сообщения';
        this.isLoading = false;
      }
    });
  }

  createPost() {
    if (!this.newPost.trim() || !this.chatId || !this.currentUserId) {
      this.errorMessage = 'Пост не может быть пустым';
      return;
    }
    if (this.isPrivateChat) {
      this.errorMessage = 'Посты недоступны в приватных чатах';
      return;
    }
  
    this.isLoading = true;
    this.itemService.createPost(this.chatId, this.currentUserId, this.newPost).subscribe({
      next: () => {
        this.newPost = '';
        this.isLoading = false;
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message || 'Ошибка создания поста';
        this.isLoading = false;
      }
    });
  }

  private scrollToBottom(): void {
    if (this.chatItemsContainer) {
      const element = this.chatItemsContainer.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  private isUserAtBottom(): boolean {
    if (!this.chatItemsContainer) {
      return true; // Default to true if container not yet available
    }
    const element = this.chatItemsContainer.nativeElement;
    return element.scrollHeight - element.scrollTop - element.clientHeight < 100;
  }

  getDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU');
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const today = new Date();
    if (d.toLocaleDateString('ru-RU') === today.toLocaleDateString('ru-RU')) {
      return 'Сегодня';
    }
    if (d.toLocaleDateString('ru-RU') === new Date(today.setDate(today.getDate() - 1)).toLocaleDateString('ru-RU')) {
      return 'Вчера';
    }
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  ngOnDestroy() {
    this.itemService.disconnectWebSocket();
  }
}