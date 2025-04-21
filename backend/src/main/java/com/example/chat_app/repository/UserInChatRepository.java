package com.example.chat_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.chat_app.entities.UserInChat;

public interface UserInChatRepository extends JpaRepository<UserInChat, Long> {
    List<UserInChat> findByChatId(Long chatId);
    List<UserInChat> findByUserId(Long userId);
    boolean existsByChatIdAndUserId(Long chatId, Long userId);
    Optional<UserInChat> findByChatIdAndUserId(Long chatId, Long userId);
}