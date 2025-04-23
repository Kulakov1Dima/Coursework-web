import { CommentDTO } from "./comment.model";

export interface ItemDTO {
    id: number;
    chat: any;
    user: { id: number; login: string; photo: string; nickname: string; surname: string; name: string };
    type: 'MESSAGE' | 'POST';
    date: string;
    message: { id: number; messageText: string; item: any } | null;
    post: { id: number; messageText: string; item: any; comments: CommentDTO[] } | null;
  }