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
  imports: [CommonModule, FormsModule, RouterModule], // Добавляем RouterModule
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.chatId = Number(this.route.snapshot.paramMap.get('chatId'));
    this.chatName = this.route.snapshot.queryParamMap.get('chatName');

    this.userService.getUserId().subscribe(userId => {
      this.currentUserId = userId;
      if (!this.currentUserId) {
        this.errorMessage = 'Пользователь не авторизован';
        return;
      }

      // Загружаем элементы чата
      this.loadChatItems();

      // Подключаемся к WebSocket
      this.itemService.connectWebSocket(this.chatId!, (newItem) => {
        this.chatItems = [...this.chatItems, newItem].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA === dateB ? a.id - b.id : dateA - dateB;
        });
      });
    });
  }

  loadChatItems() {
    if (!this.chatId) return;
    this.itemService.getChatItems(this.chatId).subscribe({
      next: (items) => {
        this.chatItems = items.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA === dateB ? a.id - b.id : dateA - dateB;
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.chatId || !this.currentUserId) return;

    this.itemService.sendMessage(this.chatId, this.currentUserId, this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  createPost() {
    if (!this.newPost.trim() || !this.chatId || !this.currentUserId) return;

    this.itemService.createPost(this.chatId, this.currentUserId, this.newPost).subscribe({
      next: () => {
        this.newPost = '';
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  ngOnDestroy() {
    this.itemService.disconnectWebSocket();
  }
}