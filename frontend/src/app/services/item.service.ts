import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client, IMessage } from '@stomp/stompjs';

declare const SockJS: any;

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

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://192.168.1.115:8081/api/items';
  private stompClient: Client | null = null;

  constructor(private http: HttpClient) {}

  getChatItems(chatId: number): Observable<ItemDTO[]> {
    return this.http
      .get<ItemDTO[]>(`${this.apiUrl}/chat/${chatId}`)
      .pipe(
        catchError(err => {
          console.error('Error loading chat items:', err);
          return throwError(() => new Error('Ошибка при загрузке элементов чата'));
        })
      );
  }

  sendMessage(chatId: number, userId: number, messageText: string): Observable<ItemDTO> {
    const url = `${this.apiUrl}/message?chatId=${chatId}&userId=${userId}&messageText=${encodeURIComponent(messageText)}`;
    return this.http
      .post<ItemDTO>(url, {})
      .pipe(
        catchError(err => {
          console.error('Error sending message:', err);
          return throwError(() => new Error('Ошибка при отправке сообщения'));
        })
      );
  }

  createPost(chatId: number, userId: number, messageText: string): Observable<ItemDTO> {
    const url = `${this.apiUrl}/post?chatId=${chatId}&userId=${userId}&messageText=${encodeURIComponent(messageText)}`;
    return this.http
      .post<ItemDTO>(url, {})
      .pipe(
        catchError(err => {
          console.error('Error creating post:', err);
          return throwError(() => new Error('Ошибка при создании поста'));
        })
      );
  }

  connectWebSocket(chatId: number, callback: (item: ItemDTO) => void): void {
    if (this.stompClient) {
      this.disconnectWebSocket();
    }

    const socket = new SockJS('http://192.168.1.115:8081/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      }
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.stompClient!.subscribe(`/topic/chat/${chatId}`, (message: IMessage) => {
        const newItem: ItemDTO = JSON.parse(message.body);
        callback(newItem);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error:', frame);
    };

    this.stompClient.activate();
  }

  disconnectWebSocket(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }
}