import api from './api';

export interface OrderDto {
    id: string;
    userId: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    items: OrderItemDto[];
}

export interface OrderItemDto {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface CreateOrderRequest {
    items: OrderItemDto[];
}

export interface UpdateOrderStatusCommand {
    id: string;
    status: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    isSuccess: boolean;
}

const orderService = {
    getAll: async () => {
        const response = await api.get<ApiResponse<OrderDto[]>>('/order');
        return response.data;
    },

    getByUserId: async (userId: string) => {
        const response = await api.get<ApiResponse<OrderDto[]>>(`/order/user/${userId}`);
        return response.data;
    },

    create: async (request: CreateOrderRequest) => {
        const response = await api.post<ApiResponse<string>>('/order', request);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await api.put<ApiResponse<string>>(`/order/${id}/status`, { id, status });
        return response.data;
    },

    cancel: async (id: string) => {
        const response = await api.put<ApiResponse<string>>(`/order/${id}/cancel`);
        return response.data;
    },
};

export default orderService;
