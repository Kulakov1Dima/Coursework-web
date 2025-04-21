package com.example.chat_app.repository;

import com.example.chat_app.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Optional<Message> findByItemId(Long itemId);
}