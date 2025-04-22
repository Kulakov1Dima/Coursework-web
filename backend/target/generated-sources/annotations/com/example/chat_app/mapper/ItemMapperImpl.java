package com.example.chat_app.mapper;

import com.example.chat_app.dto.CommentDTO;
import com.example.chat_app.dto.ItemDTO;
import com.example.chat_app.dto.MessageDTO;
import com.example.chat_app.dto.PostDTO;
import com.example.chat_app.entities.Comment;
import com.example.chat_app.entities.Item;
import com.example.chat_app.entities.Message;
import com.example.chat_app.entities.Post;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-22T23:11:55+0400",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.0.z20250331-1358, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class ItemMapperImpl implements ItemMapper {

    @Autowired
    private ChatMapper chatMapper;
    @Autowired
    private UserMapper userMapper;

    @Override
    public ItemDTO toDto(Item item) {
        if ( item == null ) {
            return null;
        }

        ItemDTO itemDTO = new ItemDTO();

        itemDTO.setDate( item.getDate() );
        itemDTO.setId( item.getId() );
        itemDTO.setType( item.getType() );
        itemDTO.setUser( userMapper.toDto( item.getUser() ) );

        return itemDTO;
    }

    @Override
    public Item toEntity(ItemDTO itemDTO) {
        if ( itemDTO == null ) {
            return null;
        }

        Item item = new Item();

        item.setChat( chatMapper.toEntity( itemDTO.getChat() ) );
        item.setDate( itemDTO.getDate() );
        item.setId( itemDTO.getId() );
        item.setMessage( messageDTOToMessage( itemDTO.getMessage() ) );
        item.setPost( postDTOToPost( itemDTO.getPost() ) );
        item.setType( itemDTO.getType() );
        item.setUser( userMapper.toEntity( itemDTO.getUser() ) );

        return item;
    }

    protected Message messageDTOToMessage(MessageDTO messageDTO) {
        if ( messageDTO == null ) {
            return null;
        }

        Message message = new Message();

        message.setId( messageDTO.getId() );
        message.setItem( toEntity( messageDTO.getItem() ) );
        message.setMessageText( messageDTO.getMessageText() );

        return message;
    }

    protected Comment commentDTOToComment(CommentDTO commentDTO) {
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
            list1.add( commentDTOToComment( commentDTO ) );
        }

        return list1;
    }

    protected Post postDTOToPost(PostDTO postDTO) {
        if ( postDTO == null ) {
            return null;
        }

        Post post = new Post();

        post.setComments( commentDTOListToCommentList( postDTO.getComments() ) );
        post.setId( postDTO.getId() );
        post.setItem( toEntity( postDTO.getItem() ) );
        post.setMessageText( postDTO.getMessageText() );

        return post;
    }
}
