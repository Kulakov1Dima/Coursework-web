package com.example.chat_app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.chat_app.entities.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByChatIdAndType(Long chatId, String type);
}
