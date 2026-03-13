import toast from "react-hot-toast";
import apiClient from "./api-client";
import type {
  ApiResponse, AuthResponseDto,
  LoginDto, RegisterDto,
  UserDto, UpdateUserCommand,
} from "./types";

export async function registerApi(data: RegisterDto): Promise<AuthResponseDto> {
  const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
    "/Auth/register", data
  );
  if (!response.data.success) {
    const msg = response.data.message || "Registration failed";
    toast.error(msg);
    throw new Error(msg); 
  }
  toast.success("Account created successfully!!");
  return response.data.data;
}

export async function loginApi(data: LoginDto): Promise<AuthResponseDto> {
  const response = await apiClient.post<ApiResponse<AuthResponseDto>>(
    "/Auth/login", data
  );
  if (!response.data.success) {
    const msg = response.data.message || "Login failed";
    toast.error(msg);
    throw new Error(msg);
  }
  toast.success("Welcome back!!");
  return response.data.data;
}

export async function getAllUsersApi(): Promise<UserDto[]> {
  const response = await apiClient.get<ApiResponse<UserDto[]>>("/Auth");
  if (!response.data.success) {
    const msg = response.data.message || "Failed to fetch users";
    toast.error(msg);
    throw new Error(msg);
  }
  return response.data.data; 
}

export async function getAllUsersIncludingDeletedApi(): Promise<UserDto[]> {
  const response = await apiClient.get<ApiResponse<UserDto[]>>("/Auth/all");
  if (!response.data.success) {
    const msg = response.data.message || "Failed to fetch all users";
    toast.error(msg);
    throw new Error(msg);
  }
  return response.data.data; 
}

export async function updateUserApi(id: string, data: UpdateUserCommand): Promise<string> {
  const response = await apiClient.put<ApiResponse<string>>(`/Auth/${id}`, data);
  if (!response.data.success) {
    const msg = response.data.message || "Update failed";
    toast.error(msg);
    throw new Error(msg);
  }
  toast.success("User updated successfully!!");
  return response.data.data;
}

export async function deleteUserApi(id: string): Promise<string> {
  const response = await apiClient.delete<ApiResponse<string>>(`/Auth/${id}`);
  if (!response.data.success) {
    const msg = response.data.message || "Deletion failed";
    toast.error(msg);
    throw new Error(msg);
  }
  toast.success("User deleted successfully!!");
  return response.data.data;
}