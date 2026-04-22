
import apiClient from '../../../auth/src/api/api-client';


export interface OfferDto {
    id: string;
    productId?: string;
    productName?: string;
    orderId?: string;
    offeredPrice: number;
    status?: string;       
    createdAt?: string;
}

export interface CreateOfferDto {
    productId: string;
    orderId?: string;
    offeredPrice: number;
}

export interface UpdateOfferDto {
    offeredPrice?: number;
    status?: string;
}


export interface ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    isSuccess?: boolean;   
    success?: boolean;     
}

export const offerService = {

    getAll: async () => {
        const response = await apiClient.get<ApiResponse<OfferDto[]>>('/Offers');
        return response.data;
    },


    getById: async (id: string) => {
        const response = await apiClient.get<ApiResponse<OfferDto>>(`/Offers/${id}`);
        return response.data;
    },

    getByProduct: async (productId: string) => {
        const response = await apiClient.get<ApiResponse<OfferDto[]>>(`/Offers/product/${productId}`);
        return response.data;
    },

    create: async (offer: CreateOfferDto) => {
        const response = await apiClient.post<ApiResponse<OfferDto>>('/Offers', offer);
        return response.data;
    },

    update: async (id: string, offer: UpdateOfferDto) => {
        const response = await apiClient.put<ApiResponse<OfferDto>>(`/Offers/${id}`, offer);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete<ApiResponse<string>>(`/Offers/${id}`);
        return response.data;
    },
};

export default offerService;
