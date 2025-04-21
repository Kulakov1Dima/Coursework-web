package com.example.chat_app.service;

import com.example.chat_app.dto.ChatDTO;
import com.example.chat_app.dto.UserDTO;
import com.example.chat_app.dto.UserInChatDTO;
import com.example.chat_app.entities.Chat;
import com.example.chat_app.entities.User;
import com.example.chat_app.entities.UserInChat;
import com.example.chat_app.mapper.ChatMapper;
import com.example.chat_app.mapper.UserInChatMapper;
import com.example.chat_app.mapper.UserMapper;
import com.example.chat_app.repository.ChatRepository;
import com.example.chat_app.repository.UserInChatRepository;
import com.example.chat_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserInChatRepository userInChatRepository;

    @Autowired
    private ChatMapper chatMapper;

    @Autowired
    private UserInChatMapper userInChatMapper;

    @Autowired
    private UserMapper userMapper;

    public ResponseEntity<ChatDTO> createChat(String name, String type, Long creatorId, Long otherUserId) {
        // Проверка корректности данных
        if (name == null || name.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (type == null || (!type.equals("PUBLIC") && !type.equals("PRIVATE"))) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Проверка существования пользователей
        Optional<User> creator = userRepository.findById(creatorId);
        Optional<User> otherUser = otherUserId != null ? userRepository.findById(otherUserId) : Optional.empty();

        if (creator.isEmpty() || (otherUserId != null && otherUser.isEmpty())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Создание чата
        Chat chat = new Chat();
        chat.setName(name);
        chat.setType(type);
        Chat savedChat = chatRepository.save(chat);

        // Добавление создателя в чат
        UserInChat creatorInChat = new UserInChat();
        creatorInChat.setChat(savedChat);
        creatorInChat.setUser(creator.get());
        userInChatRepository.save(creatorInChat);

        // Добавление второго пользователя в чат (если указан)
        if (otherUserId != null && otherUser.isPresent()) {
            UserInChat otherUserInChat = new UserInChat();
            otherUserInChat.setChat(savedChat);
            otherUserInChat.setUser(otherUser.get());
            userInChatRepository.save(otherUserInChat);
        }

        ChatDTO createdChat = chatMapper.toDto(savedChat);
        // Вручную мапим userInChats
        createdChat.setUserInChats(userInChatRepository.findByChatId(savedChat.getId())
                .stream()
                .map(userInChatMapper::toDto)
                .collect(Collectors.toList()));
        return new ResponseEntity<>(createdChat, HttpStatus.CREATED);
    }

    public ResponseEntity<UserInChatDTO> addUserToChat(Long chatId, Long userId) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (chatOpt.isEmpty() || userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (userInChatRepository.existsByChatIdAndUserId(chatId, userId)) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Chat chat = chatOpt.get();
        User user = userOpt.get();

        UserInChat userInChat = new UserInChat();
        userInChat.setChat(chat);
        userInChat.setUser(user);

        UserInChat savedUserInChat = userInChatRepository.save(userInChat);
        UserInChatDTO userInChatDTO = userInChatMapper.toDto(savedUserInChat);
        // Вручную мапим chat
        userInChatDTO.setChat(chatMapper.toDto(chat));
        return new ResponseEntity<>(userInChatDTO, HttpStatus.CREATED);
    }

    // Получение чата по id

    public ResponseEntity<ChatDTO> getChatById(Long id) {
        return chatRepository.findById(id)
                .map(chat -> {
                    ChatDTO chatDTO = chatMapper.toDto(chat);
                    return new ResponseEntity<>(chatDTO, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Получение пользователей чата
    
    public ResponseEntity<List<UserDTO>> getUsersInChat(Long chatId) {
        if (!chatRepository.existsById(chatId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    
        List<UserInChat> usersInChat = userInChatRepository.findByChatId(chatId);
        List<UserDTO> userDTOs = usersInChat.stream()
                .map(userInChat -> (UserDTO) userMapper.toDto(userInChat.getUser()))
                .collect(Collectors.toList());
        return new ResponseEntity<>(userDTOs, HttpStatus.OK);
    }

    
    public ResponseEntity<List<ChatDTO>> getChatsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<UserInChat> userInChats = userInChatRepository.findByUserId(userId);
        List<ChatDTO> chatDTOs = userInChats.stream()
                .map(UserInChat::getChat)
                .map(chat -> chatMapper.toDto(chat))
                .collect(Collectors.toList());
        
        return new ResponseEntity<>(chatDTOs, HttpStatus.OK);
    }

    public ResponseEntity<Void> deleteChat(Long chatId) {
        if (!chatRepository.existsById(chatId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        chatRepository.deleteById(chatId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    public ResponseEntity<Void> removeUserFromChat(Long chatId, Long userId) {
        Optional<UserInChat> userInChatOpt = userInChatRepository.findByChatIdAndUserId(chatId, userId);
        if (userInChatOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        userInChatRepository.delete(userInChatOpt.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    public ResponseEntity<ChatDTO> updateChatName(Long chatId, String newName) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (newName == null || newName.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Chat chat = chatOpt.get();
        chat.setName(newName);
        Chat updatedChat = chatRepository.save(chat);
        ChatDTO updatedChatDTO = chatMapper.toDto(updatedChat);
        // Вручную мапим userInChats
        updatedChatDTO.setUserInChats(userInChatRepository.findByChatId(updatedChat.getId())
                .stream()
                .map(userInChatMapper::toDto)
                .collect(Collectors.toList()));
        return new ResponseEntity<>(updatedChatDTO, HttpStatus.OK);
    }
}