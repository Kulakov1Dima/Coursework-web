import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ItemService } from '../services/item.service';
import { UserService } from '../services/user.service';

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
formatDate(arg0: string) {
throw new Error('Method not implemented.');
}
getDate(arg0: string) {
throw new Error('Method not implemented.');
}
  chatId: number | null = null;
  chatName: string | null = null;
  currentUserId: number | null = null;
  chatItems: ItemDTO[] = [];
  newMessage: string = '';
  newPost: string = '';
  errorMessage: string | null = null;
  isLoading = false; // Добавляем для UX
isPrivateChat: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private userService: UserService
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

        this.loadChatItems();

        this.itemService.connectWebSocket(this.chatId!, (newItem) => {
          this.chatItems = [...this.chatItems, newItem].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA === dateB ? a.id - b.id : dateA - dateB;
          });
        });
      },
      error: () => {
        this.errorMessage = 'Ошибка получения данных пользователя';
        this.router.navigate(['/login']);
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
        this.chatItems = items.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA === dateB ? a.id - b.id : dateA - dateB;
        });
        this.isLoading = false;
      },
      error: (err) => {
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
      },
      error: (err) => {
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

    this.isLoading = true;
    this.itemService.createPost(this.chatId, this.currentUserId, this.newPost).subscribe({
      next: () => {
        this.newPost = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Ошибка создания поста';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.itemService.disconnectWebSocket();
  }
}