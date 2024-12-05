import $api from '../../configs/axiosconfig/axios.js';
import { IProvider } from './providers.js';

export const createProvider = (newProviderData: IProvider) => {
    const response = $api.post("/providers", newProviderData);
    return response;
};

export const getProviders = () => {
    const response = $api.get("/providers");
    return response;
};

export const deleteProvider = (providerId: number) => {
    const response = $api.delete(`/providers?providerId=${providerId}`);
    return response;
};

export const updateProvider = (newProviderData: IProvider) => {
    const response = $api.put("/providers", newProviderData);
    return response;
};