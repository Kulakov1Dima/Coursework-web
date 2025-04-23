export interface CommentDTO {
    id: number;
    post: any;
    user: { id: number; login: string; photo: string; nickname: string; surname: string; name: string };
    textContent: string;
  }