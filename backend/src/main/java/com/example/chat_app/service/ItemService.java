package com.example.chat_app.service;

import com.example.chat_app.dto.ItemDTO;
import com.example.chat_app.entities.Chat;
import com.example.chat_app.entities.Item;
import com.example.chat_app.entities.Message;
import com.example.chat_app.entities.Post;
import com.example.chat_app.entities.User;
import com.example.chat_app.mapper.ItemMapper;
import com.example.chat_app.mapper.MessageMapper;
import com.example.chat_app.mapper.PostMapper;
import com.example.chat_app.repository.ChatRepository;
import com.example.chat_app.repository.ItemRepository;
import com.example.chat_app.repository.MessageRepository;
import com.example.chat_app.repository.PostRepository;
import com.example.chat_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ResponseEntity<ItemDTO> sendMessage(Long chatId, Long userId, String messageText) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (messageText == null || messageText.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = userOpt.get();
        Chat chat = chatOpt.get();

        Item item = new Item();
        item.setChat(chat);
        item.setUser(user);
        item.setType("MESSAGE");
        item.setDate(LocalDate.now());
        Item savedItem = itemRepository.save(item);

        Message message = new Message();
        message.setMessageText(messageText);
        message.setItem(savedItem);
        Message savedMessage = messageRepository.save(message);

        ItemDTO itemDTO = itemMapper.toDto(savedItem);
        itemDTO.setMessage(messageMapper.toDto(savedMessage));

        messagingTemplate.convertAndSend("/topic/chat/" + chatId, itemDTO);

        return new ResponseEntity<>(itemDTO, HttpStatus.CREATED);
    }

    public ResponseEntity<ItemDTO> createPost(Long chatId, Long userId, String messageText) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (messageText == null || messageText.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = userOpt.get();
        Chat chat = chatOpt.get();

        Item item = new Item();
        item.setChat(chat);
        item.setUser(user);
        item.setType("POST");
        item.setDate(LocalDate.now());
        Item savedItem = itemRepository.save(item);

        Post post = new Post();
        post.setMessageText(messageText);
        post.setItem(savedItem);
        Post savedPost = postRepository.save(post);

        ItemDTO itemDTO = itemMapper.toDto(savedItem);
        itemDTO.setPost(postMapper.toDto(savedPost));

        messagingTemplate.convertAndSend("/topic/chat/" + chatId, itemDTO);

        return new ResponseEntity<>(itemDTO, HttpStatus.CREATED);
    }

    public ResponseEntity<List<ItemDTO>> getItemsByChatId(Long chatId) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Chat chat = chatOpt.get();
        List<ItemDTO> itemDTOs = chat.getItems().stream()
                .map(item -> {
                    ItemDTO itemDTO = itemMapper.toDto(item);
                    if ("MESSAGE".equals(item.getType())) {
                        Optional<Message> messageOpt = messageRepository.findByItemId(item.getId());
                        messageOpt.ifPresent(message -> itemDTO.setMessage(messageMapper.toDto(message)));
                    } else if ("POST".equals(item.getType())) {
                        Optional<Post> postOpt = postRepository.findByItemId(item.getId());
                        postOpt.ifPresent(post -> itemDTO.setPost(postMapper.toDto(post)));
                    }
                    return itemDTO;
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(itemDTOs, HttpStatus.OK);
    }
}