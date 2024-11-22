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

    const handleSearchProviderByTypesNumber = (typeNumber: number) => {
        let filteredProviderByActive: IProvider[] = [];
        if (typeNumber === 0 || typeNumber === 1) {
            filteredProviderByActive = providers.filter(provider => {
                return provider.active === Boolean(typeNumber) && !provider.deletedAt;
            });
        }
        if (typeNumber === 2) {
            filteredProviderByActive = providers.filter(provider => provider.deletedAt);
        }
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
        setProviders(prev => prev.map(el => {
            if (el.id === provider.id) {
                return { ...el, deletedAt: new Date().toISOString(), active: false };
            }
            return el;
        }));
        setFilteredProviders(prev => prev.map(el => {
            if (el.id === provider.id) {
                return { ...el, deletedAt: new Date().toISOString(), active: false };
            }
            return el;
        }));
    };

    const handleRestoreProviderAnywhere = (provider: IProvider) => {
        setProviders(prev => prev.map(el => {
            if (el.id === provider.id) return { ...el, deletedAt: null }; return el;
        }));
        setFilteredProviders(prev => prev.map(el => {
            if (el.id === provider.id) return { ...el, deletedAt: null }; return el;
        } ));
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
        const date = new Date();
        const newProviderWithId: IProvider = {
            ...newProviderData,
            dateOfCreation: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
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
        handleSearchProviderByTypesNumber,
        handleRestoreProviderAnywhere
    };
};
