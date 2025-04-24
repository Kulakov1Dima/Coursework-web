package com.example.chat_app.controller;

import com.example.chat_app.dto.ChatDTO;
import com.example.chat_app.dto.UserDTO;
import com.example.chat_app.dto.UserInChatDTO;
import com.example.chat_app.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatDTO> createChat(
            @RequestParam String name,
            @RequestParam String type,
            @RequestParam Long creatorId,
            @RequestParam(required = false) Long otherUserId) {
        return chatService.createChat(name, type, creatorId, otherUserId);
    }

    // Получение чата по ид
     
    @GetMapping("/{chatId}")
    public ResponseEntity<ChatDTO> getChatById(@PathVariable Long chatId) {
        return chatService.getChatById(chatId);
    }

    // Получение пользователей чата 

    @GetMapping("/{chatId}/users")
    public ResponseEntity<List<UserDTO>> getUsersInChat(@PathVariable Long chatId) {
        return chatService.getUsersInChat(chatId);
    }

    // Получение чатов по ид пользователя

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatDTO>> getChatsByUserId(@PathVariable Long userId) {
        return chatService.getChatsByUserId(userId);
    }

    // Добавление пользователя в чат

    @PostMapping("/{chatId}/users/{userId}")
    public ResponseEntity<UserInChatDTO> addUserToChat(
            @PathVariable Long chatId,
            @PathVariable Long userId) {
        return chatService.addUserToChat(chatId, userId);
    }

    // Удаление чата

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long chatId) {
        return chatService.deleteChat(chatId);
    }

    // Удаление пользователя из чата

    @DeleteMapping("/{chatId}/users/{userId}")
    public ResponseEntity<Void> removeUserFromChat(
            @PathVariable Long chatId,
            @PathVariable Long userId) {
        return chatService.removeUserFromChat(chatId, userId);
    }

    // Изменение имени чата
    @PutMapping("/{chatId}/name")
    public ResponseEntity<ChatDTO> updateChatName(
            @PathVariable Long chatId,
            @RequestParam String newName) {
        return chatService.updateChatName(chatId, newName);
    }
}