package com.example.chat_app.mapper;

import com.example.chat_app.dto.ChatDTO;
import com.example.chat_app.dto.CommentDTO;
import com.example.chat_app.dto.ItemDTO;
import com.example.chat_app.dto.MessageDTO;
import com.example.chat_app.dto.PostDTO;
import com.example.chat_app.dto.UserInChatDTO;
import com.example.chat_app.entities.Chat;
import com.example.chat_app.entities.Comment;
import com.example.chat_app.entities.Item;
import com.example.chat_app.entities.Message;
import com.example.chat_app.entities.Post;
import com.example.chat_app.entities.UserInChat;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-21T12:43:44+0400",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class CommentMapperImpl implements CommentMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public CommentDTO toDto(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        CommentDTO commentDTO = new CommentDTO();

        commentDTO.setId( comment.getId() );
        commentDTO.setTextContent( comment.getTextContent() );
        commentDTO.setUser( userMapper.toDto( comment.getUser() ) );

        return commentDTO;
    }

    @Override
    public List<CommentDTO> toDtoList(List<Comment> comments) {
        if ( comments == null ) {
            return null;
        }

        List<CommentDTO> list = new ArrayList<CommentDTO>( comments.size() );
        for ( Comment comment : comments ) {
            list.add( toDto( comment ) );
        }

        return list;
    }

    @Override
    public Comment toEntity(CommentDTO commentDTO) {
        if ( commentDTO == null ) {
            return null;
        }

        Comment comment = new Comment();

        comment.setId( commentDTO.getId() );
        comment.setPost( postDTOToPost( commentDTO.getPost() ) );
        comment.setTextContent( commentDTO.getTextContent() );
        comment.setUser( userMapper.toEntity( commentDTO.getUser() ) );

        return comment;
    }

    protected List<Comment> commentDTOListToCommentList(List<CommentDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<Comment> list1 = new ArrayList<Comment>( list.size() );
        for ( CommentDTO commentDTO : list ) {
            list1.add( toEntity( commentDTO ) );
        }

        return list1;
    }

    protected List<Item> itemDTOListToItemList(List<ItemDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<Item> list1 = new ArrayList<Item>( list.size() );
        for ( ItemDTO itemDTO : list ) {
            list1.add( itemDTOToItem( itemDTO ) );
        }

        return list1;
    }

    protected UserInChat userInChatDTOToUserInChat(UserInChatDTO userInChatDTO) {
        if ( userInChatDTO == null ) {
            return null;
        }

        UserInChat userInChat = new UserInChat();

        userInChat.setChat( chatDTOToChat( userInChatDTO.getChat() ) );
        userInChat.setId( userInChatDTO.getId() );
        userInChat.setUser( userMapper.toEntity( userInChatDTO.getUser() ) );

        return userInChat;
    }

    protected List<UserInChat> userInChatDTOListToUserInChatList(List<UserInChatDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<UserInChat> list1 = new ArrayList<UserInChat>( list.size() );
        for ( UserInChatDTO userInChatDTO : list ) {
            list1.add( userInChatDTOToUserInChat( userInChatDTO ) );
        }

        return list1;
    }

    protected Chat chatDTOToChat(ChatDTO chatDTO) {
        if ( chatDTO == null ) {
            return null;
        }

        Chat chat = new Chat();

        chat.setId( chatDTO.getId() );
        chat.setItems( itemDTOListToItemList( chatDTO.getItems() ) );
        chat.setName( chatDTO.getName() );
        chat.setType( chatDTO.getType() );
        chat.setUserInChats( userInChatDTOListToUserInChatList( chatDTO.getUserInChats() ) );

        return chat;
    }

    protected Message messageDTOToMessage(MessageDTO messageDTO) {
        if ( messageDTO == null ) {
            return null;
        }

        Message message = new Message();

        message.setId( messageDTO.getId() );
        message.setItem( itemDTOToItem( messageDTO.getItem() ) );
        message.setMessageText( messageDTO.getMessageText() );

        return message;
    }

    protected Item itemDTOToItem(ItemDTO itemDTO) {
        if ( itemDTO == null ) {
            return null;
        }

        Item item = new Item();

        item.setChat( chatDTOToChat( itemDTO.getChat() ) );
        item.setDate( itemDTO.getDate() );
        item.setId( itemDTO.getId() );
        item.setMessage( messageDTOToMessage( itemDTO.getMessage() ) );
        item.setPost( postDTOToPost( itemDTO.getPost() ) );
        item.setType( itemDTO.getType() );
        item.setUser( userMapper.toEntity( itemDTO.getUser() ) );

        return item;
    }

    protected Post postDTOToPost(PostDTO postDTO) {
        if ( postDTO == null ) {
            return null;
        }

        Post post = new Post();

        post.setComments( commentDTOListToCommentList( postDTO.getComments() ) );
        post.setId( postDTO.getId() );
        post.setItem( itemDTOToItem( postDTO.getItem() ) );
        post.setMessageText( postDTO.getMessageText() );

        return post;
    }
}
