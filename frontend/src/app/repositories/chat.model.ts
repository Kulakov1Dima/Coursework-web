export interface Chat {
    id: number;
    name: string;
    type: 'PUBLIC' | 'PRIVATE';
    userInChats: any;
    items: any;
  }