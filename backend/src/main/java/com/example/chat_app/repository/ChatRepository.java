package com.example.chat_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.chat_app.entities.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByNameContainingIgnoreCase(String name);
}
