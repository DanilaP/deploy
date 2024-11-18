import { useEffect, useState } from "react";
import $api from "../configs/axiosconfig/axios.js";
import { IProvider, ISelect } from "../interfaces/interfaces.js";

export const useProvidersHelper = () => {

    const [providers, setProviders] = useState<IProvider[]>([]);
    const [filteredProviders, setFilteredProviders] = useState<IProvider[]>([] as IProvider[]);
    const [providersForSelect, setProvidersForSelect] = useState<ISelect[]>([] as ISelect[]);

    const fetchProvidersData = async () => {
        const response = await $api.get("/providers");
        if (response.data.providers) {
            setProviders(response.data.providers);
            setFilteredProviders(response.data.providers);
            handleSetProvidersForSelect(response.data.providers);
        }
    };

    const handleSearchProviderByActive = (isActive: boolean) => {
        const filteredProviderByActive = providers.filter(provider => {
            return provider.active === isActive;
        });
        setFilteredProviders(filteredProviderByActive);
        return filteredProviderByActive;
    };

    const handleSetProvidersForSelect = (providersList: IProvider[]) => {
        const providersForSelect: any = providersList.map((provider: IProvider) => {
            return { id: Number(provider.id), label: provider.name };
        });
        setProvidersForSelect(providersForSelect);
        return providersForSelect;
    };

    const handleDeleteProvider = (provider: IProvider) => {
        setProviders(prev => prev.filter(el => el.id !== provider.id));
        setFilteredProviders(prev => prev.filter(el => el.id !== provider.id));
    };

    const handleUpdateProvider = (newProviderData: IProvider) => {
        setProviders(prev => prev.map(el => {
            if (el.id === newProviderData.id) return newProviderData;
            return el;
        }));
        setFilteredProviders(prev => prev.map(el => {
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
        setFilteredProviders(prev => [...prev, newProviderWithId]);
    };

    const handleSearchProvidersByAllFields = (inputValue: string) => {
        if (inputValue.length === 0) {
            setFilteredProviders(providers);
            return;
        }
        if (inputValue.length < import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH) return;
        const searchValue = inputValue.toLowerCase();
        setFilteredProviders((prev) => prev.filter(el => {
            return Number(searchValue) === el.id ||
                el.contactPerson.name.toLowerCase().includes(searchValue) ||
                el.contactPerson.phoneNumber.toLowerCase().includes(searchValue) ||
                el.contactPerson.post.toLowerCase().includes(searchValue) ||
                el.description.toLowerCase().includes(searchValue) ||
                el.name.toLowerCase().includes(searchValue) ||
                el.website.toLowerCase().includes(searchValue); 
        }));
    };


    useEffect(() => {
        fetchProvidersData();
    }, []);

    return { 
        providers, 
        filteredProviders,
        providersForSelect,
        handleDeleteProvider, 
        handleUpdateProvider, 
        handleCreateProvider,
        handleSearchProvidersByAllFields,
        handleSetProvidersForSelect,
        handleSearchProviderByActive
    };
};
