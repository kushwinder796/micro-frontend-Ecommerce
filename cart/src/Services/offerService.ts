import api from './api';

export interface OfferDto {
    id: string;
    name: string;
    description: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    promoCode: string;
    isActive: boolean;
}

export interface CreateOfferDto {
    name: string;
    description: string;
    discountPercentage: number;
    startDate: string;
    endDate: string;
    promoCode: string;
}

export interface UpdateOfferDto extends CreateOfferDto {
    isActive: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    isSuccess: boolean;
}

const offerService = {
    getAll: async () => {
        const response = await api.get<ApiResponse<OfferDto[]>>('/offers');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiResponse<OfferDto>>(`/offers/${id}`);
        return response.data;
    },

    create: async (offer: CreateOfferDto) => {
        const response = await api.post<ApiResponse<OfferDto>>('/offers', offer);
        return response.data;
    },

    update: async (id: string, offer: UpdateOfferDto) => {
        const response = await api.put<ApiResponse<OfferDto>>(`/offers/${id}`, offer);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<ApiResponse<string>>(`/offers/${id}`);
        return response.data;
    },
};

export default offerService;
