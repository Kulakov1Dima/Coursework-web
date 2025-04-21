  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { Chat } from '../repositories/chat.model';
  import { User } from '../repositories/user.model';
import { environment } from '../environments/environment';
  
  @Injectable({
    providedIn: 'root'
  })
  export class ChatService {
    private apiUrl = `${environment.apiUrl}/chats/`; 
  
    constructor(private http: HttpClient) {}
  
    getChats(userId: number): Observable<Chat[]> {
      const url = `${this.apiUrl}user/${userId}`;
      return this.http.get<Chat[]>(url);
    }
  
    getChatUsers(chatId: number): Observable<User[]> {
      const url = `${this.apiUrl}${chatId}/users`;
      return this.http.get<User[]>(url);
    }
  
    removeUserFromChat(chatId: number, userId: number): Observable<void> {
      const url = `${this.apiUrl}${chatId}/users/${userId}`;
      return this.http.delete<void>(url);
    }
  }