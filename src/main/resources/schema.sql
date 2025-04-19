CREATE SEQUENCE users_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE chat_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE user_in_chat_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE item_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE message_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE post_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE comment_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE Users (
    id BIGINT PRIMARY KEY DEFAULT nextval('users_id_seq'),
    login VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    photo VARCHAR,
    nickname VARCHAR,
    surname VARCHAR,
    name VARCHAR
);

CREATE TABLE Chat (
    id BIGINT PRIMARY KEY DEFAULT nextval('chat_id_seq'),
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL
);

CREATE TABLE User_in_chat (
    id BIGINT PRIMARY KEY DEFAULT nextval('user_in_chat_id_seq'),
    chat_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (chat_id) REFERENCES Chat(id)
);

CREATE TABLE Item (
    id BIGINT PRIMARY KEY DEFAULT nextval('item_id_seq'),
    chat_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    type VARCHAR NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (chat_id) REFERENCES Chat(id)
);

CREATE TABLE Message (
    id BIGINT PRIMARY KEY DEFAULT nextval('message_id_seq'),
    message_text TEXT,
    item_id BIGINT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES Item(id)
);

CREATE TABLE Post (
    id BIGINT PRIMARY KEY DEFAULT nextval('post_id_seq'),
    message_text TEXT,
    item_id BIGINT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES Item(id)
);

CREATE TABLE Comment (
    id BIGINT PRIMARY KEY DEFAULT nextval('comment_id_seq'),
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    text_content TEXT,
    FOREIGN KEY (post_id) REFERENCES Post(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);