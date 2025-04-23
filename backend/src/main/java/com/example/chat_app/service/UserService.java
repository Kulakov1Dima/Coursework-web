package com.example.chat_app.service;

import com.example.chat_app.dto.UserDTO;
import com.example.chat_app.dto.UserRegistrationDTO;
import com.example.chat_app.entities.User;
import com.example.chat_app.mapper.UserMapper;
import com.example.chat_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<UserDTO> registerUser(UserRegistrationDTO userDTO) {
        if (userRepository.findByLogin(userDTO.getLogin()).isPresent()) {
            return ResponseEntity.status(409).build();
        }
        User user = new User();
        user.setLogin(userDTO.getLogin());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setNickname(userDTO.getNickname());
        user.setName(userDTO.getName());
        user.setSurname(userDTO.getSurname());
        user.setPhoto(userDTO.getPhoto());
        userRepository.save(user);

        UserDTO responseDTO = new UserDTO();
        responseDTO.setId(user.getId());
        responseDTO.setLogin(user.getLogin());
        responseDTO.setNickname(user.getNickname());
        responseDTO.setName(user.getName());
        responseDTO.setSurname(user.getSurname());
        responseDTO.setPhoto(user.getPhoto());
        return ResponseEntity.status(201).body(responseDTO);
    }

    public ResponseEntity<UserDTO> createUser(UserDTO userDTO) {
        if (userDTO.getLogin() == null || userDTO.getLogin().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByLogin(userDTO.getLogin())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        User savedUser = userRepository.save(user);
        UserDTO createdUser = userMapper.toDto(savedUser);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    public ResponseEntity<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> new ResponseEntity<>(userMapper.toDto(user), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    public ResponseEntity<?> deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> updateUser(Long id, UserDTO updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        if (updatedUser.getLogin() != null) {
            user.setLogin(updatedUser.getLogin());
        }
        if (updatedUser.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword())); 
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
                .map(user -> new ResponseEntity<>(userMapper.toDto(user), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    public Optional<User> findByLogin(String login) {
        return userRepository.findByLogin(login);
    }
}