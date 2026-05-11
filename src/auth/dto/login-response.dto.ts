export class LoginResponseDto {
  accessToken: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}
