import { Exclude } from 'class-transformer';

export class User {
  id: number;
  username: string;
  githubUsername?: string;
  avatarUrl?: string;
  role: string;
  resetToken?: string;

  @Exclude()
  password: string;
}
