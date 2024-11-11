import { useEffect, useState } from "react";
import $api from "../configs/axiosconfig/axios.js";
import { IProvider } from "../interfaces/interfaces.js";

export const useProvidersHelper = () => {

    const [providers, setProviders] = useState<IProvider[]>([]);

    const fetchProvidersData = async () => {
        const response = await $api.get("/providers");
        if (response.data.providers) setProviders(response.data.providers);
    };

    const handleDeleteProvider = (provider: IProvider) => {
        setProviders(prev => prev.filter(el => el.id !== provider.id));
    };

    const handleUpdateProvider = (newProviderData: IProvider) => {
        setProviders(prev => prev.map(el => {
            if (el.id === newProviderData.id) return newProviderData;
            return el;
        }));
    };

    const handleCreateProvider = (newProviderData: IProvider) => {
        const newProviderWithId = {
            ...newProviderData,
            id: Date.now(),
            contactPerson: {
                ...newProviderData.contactPerson,
                id: Date.now() + 1
            }
        };
        setProviders(prev => [...prev, newProviderWithId]);
    };

    useEffect(() => {
        fetchProvidersData();
    }, []);

    return { providers, handleDeleteProvider, handleUpdateProvider, handleCreateProvider };
};
