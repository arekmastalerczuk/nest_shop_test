export type RegisterUserResponse = {
  id: string;
  email: string;
  nickname: string
} | {
  isSuccess: false;
  message: string;
}

export type VerifyUserResponse = {
  isSuccess: false;
  message: string;
} | {
  isSuccess: true;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
