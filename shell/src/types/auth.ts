
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

export interface AuthResponseDto {
    token: string;
    user: UserDto;
}

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    userId: string ;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
