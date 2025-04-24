package com.example.chat_app.service;

import com.example.chat_app.dto.CommentDTO;
import com.example.chat_app.entities.Comment;
import com.example.chat_app.entities.Post;
import com.example.chat_app.entities.User;
import com.example.chat_app.mapper.CommentMapper;
import com.example.chat_app.repository.CommentRepository;
import com.example.chat_app.repository.PostRepository;
import com.example.chat_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ResponseEntity<CommentDTO> createComment(Long postId, Long userId, String textContent) {
        Optional<Post> postOpt = postRepository.findById(postId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (postOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (textContent == null || textContent.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Comment comment = new Comment();
        comment.setPost(postOpt.get());
        comment.setUser(userOpt.get());
        comment.setTextContent(textContent);
        Comment savedComment = commentRepository.save(comment);

        CommentDTO commentDTO = commentMapper.toDto(savedComment);
        messagingTemplate.convertAndSend("/topic/post/" + postId + "/comments", commentDTO);

        return new ResponseEntity<>(commentDTO, HttpStatus.CREATED);
    }

    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        if (comments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(comments.stream().map(commentMapper::toDto).collect(Collectors.toList()), HttpStatus.OK);
    }
}