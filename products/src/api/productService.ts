import toast from "react-hot-toast";
import apiClient from "./apiClient";
import type { ApiResponse } from "./categoryService";

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  categoryId: number;
  imageUrl?: string;
}

export interface CreateProductCommand {
  name: string;
  price: number;
  categoryId: number;
  image?: File;
}

export interface UpdateProductCommand {
  id:string;
  name: string;
  price: number;
  categoryId: number;
}

export const productService = {
  getAll: async (): Promise<ProductDto[]> => {
    const response = await apiClient.get<ApiResponse<ProductDto[]>>("/Product");
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  create: async (command: CreateProductCommand): Promise<string> => {
    const formData = new FormData();
    formData.append("Name",       command.name);
    formData.append("Price",      command.price.toString());
    formData.append("CategoryId", command.categoryId.toString());
    if (command.image) formData.append("Image", command.image);

    const response = await apiClient.post<ApiResponse<string>>("/Product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!response.data.success) {
      toast.error(response.data.message || "Failed to add product");
      throw new Error(response.data.message);
    }
    toast.success("Product added !!");
    return response.data.data;
  },

  update: async (id:string, command: UpdateProductCommand): Promise<string> => {
    const response = await apiClient.put<ApiResponse<string>>(`/Product/${id}`, {
      ...command,
      id:id
    });
    if (!response.data.success) {
      toast.error(response.data.message || "Failed to update product");
      throw new Error(response.data.message);
    }
    toast.success("Product updated!!");
    return response.data.data;
  },

  delete: async (id: string): Promise<string> => {
    const response = await apiClient.delete<ApiResponse<string>>(`/Product/${id}`);
    if (!response.data.success) {
      toast.error(response.data.message || "Failed to delete product");
      throw new Error(response.data.message);
    }
    toast.success("Product deleted !!");
    return response.data.data;
  },
};