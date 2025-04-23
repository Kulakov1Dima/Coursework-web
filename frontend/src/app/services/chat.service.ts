import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../repositories/chat.model';
import { UserDTO } from './user.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.baseUrl}/chats`;

  constructor(private http: HttpClient) {}

  getChats(userId: number): Observable<Chat[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<Chat[]>(url);
  }

  getChat(chatId: number): Observable<Chat> {
    const url = `${this.apiUrl}/${chatId}`;
    return this.http.get<Chat>(url);
  }

  getChatUsers(chatId: number): Observable<UserDTO[]> {
    const url = `${this.apiUrl}/${chatId}/users`;
    return this.http.get<UserDTO[]>(url);
  }

  addUserToChat(chatId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${chatId}/users/${userId}`;
    return this.http.post(url, {});
  }

  removeUserFromChat(chatId: number, userId: number): Observable<void> {
    const url = `${this.apiUrl}/${chatId}/users/${userId}`;
    return this.http.delete<void>(url);
  }

  createChat(name: string, type: string, creatorId: number): Observable<Chat> {
    const url = this.apiUrl;
    let params = new HttpParams()
      .set('name', name)
      .set('type', type)
      .set('creatorId', creatorId.toString());
    return this.http.post<Chat>(url, {}, { params });
  }

  deleteChat(chatId: number): Observable<void> {
    const url = `${this.apiUrl}/${chatId}`;
    return this.http.delete<void>(url);
  }
}