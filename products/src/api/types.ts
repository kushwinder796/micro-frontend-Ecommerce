export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  categoryId: string;
  categoryName: string;
  badge?: string;
  rating: number;
  reviews: number;
  specs: string[];
  stock: number;
}

export interface AddProductDto {
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  categoryId: string;
  specs: string[];
  stock: number;
  
}

export interface AddCategoryDto {
  name: string;
  icon: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  errors: null;
}
