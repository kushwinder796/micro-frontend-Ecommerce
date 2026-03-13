export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export interface AuthResponseDto {
    token: string;
    user: UserDto;
}

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface UpdateUserCommand {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

 export interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
