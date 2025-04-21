package com.example.chat_app.service;

import com.example.chat_app.dto.UserDTO;
import com.example.chat_app.entities.User;
import com.example.chat_app.mapper.UserMapper;
import com.example.chat_app.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public ResponseEntity<UserDTO> createUser(UserDTO userDTO) {
        if (userDTO.getLogin() == null || userDTO.getLogin().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByLogin(userDTO.getLogin())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        User user = userMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        UserDTO createdUser = userMapper.toDto(savedUser);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    public ResponseEntity<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    UserDTO userDTO = userMapper.toDto(user);
                    return new ResponseEntity<>(userDTO, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Удаление пользователя

    public ResponseEntity<?> deleteUser(Long id) {
        if(!userRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    //Обновление пользователя

    public ResponseEntity<?> updateUser(Long id, UserDTO updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if(!optionalUser.isPresent()){
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

         // Обновляем только предоставленные поля
         if (updatedUser.getLogin() != null) {
            user.setLogin(updatedUser.getLogin());
        }
        if (updatedUser.getPassword() != null) {
            user.setPassword(updatedUser.getPassword());
        }
        if (updatedUser.getPhoto() != null) {
            user.setPhoto(updatedUser.getPhoto());
        }
        if (updatedUser.getNickname() != null) {
            user.setNickname(updatedUser.getNickname());
        }
        if (updatedUser.getSurname() != null) {
            user.setSurname(updatedUser.getSurname());
        }
        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }

        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
    

    public ResponseEntity<UserDTO> getUserByLogin(String login) {
        return userRepository.findByLogin(login)
                .map(user -> {
                    UserDTO userDTO = userMapper.toDto(user);
                    return new ResponseEntity<>(userDTO, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Список всех пользователей

    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users =  userRepository.findAll()
                .stream()
                .map(user -> userMapper.toDto(user))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(users);
    }
}