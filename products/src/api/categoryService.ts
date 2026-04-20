import toast from "react-hot-toast";
import apiClient from "../../../auth/src/api/api-client";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  errors: null;
}

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
}

export interface CreateCategoryCommand {
  name: string;
  description?: string;
}

export interface UpdateCategoryCommand {
  id: number;
  name: string;
  description?: string;
}

export const categoryService = {
  getAll: async (): Promise<CategoryDto[]> => {
    const response = await apiClient.get<ApiResponse<CategoryDto[]>>("/Category");
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  create: async (command: CreateCategoryCommand): Promise<number> => {
    const response = await apiClient.post<ApiResponse<number>>("/Category", command);
    if (!response.data.success) {
      toast.error(response.data.message || "Failed to add category");
      throw new Error(response.data.message);
    }
    toast.success("Category added !!");
    return response.data.data;
  },

  update: async (id: number, command: UpdateCategoryCommand): Promise<string> => {
    const response = await apiClient.put<ApiResponse<string>>(`/Category/${id}`, command);
    if (!response.data.success) {
      toast.error(response.data.message || "Failed to update category");
      throw new Error(response.data.message);
    }
    toast.success("Category updated !!");
    return response.data.data;
  },

  delete: async (id: number): Promise<string> => {
    const response = await apiClient.delete<ApiResponse<string>>(`/Category/${id}`);
    if (!response.data.success) {
      toast.error(response.data.message || "Failed to delete category");
      throw new Error(response.data.message);
    }
    toast.success("Category deleted !!");
    return response.data.data;
  },
};