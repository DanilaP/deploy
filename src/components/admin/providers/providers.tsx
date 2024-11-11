import { useState } from "react";
import { useProvidersHelper } from "../../../helpers/use-providers-helper";
import ProvidersPageView from "./providers-page-view/providersPageView";
import { IProvider } from "../../../interfaces/interfaces";
import { DEFAULT_PROVIDER } from "./constants";

export default function ProvidersPage() {
    
    const { 
        providers,
        handleDeleteProvider,
        handleUpdateProvider,
        handleCreateProvider
    } = useProvidersHelper();

    const [modals, setModals] = useState({ manage: false, deleteConfirmation: false });
    const [choosedProvider, setChoosedProvider] = useState<IProvider>(DEFAULT_PROVIDER);

    const handleOnCreateProvider = (newProviderData: IProvider) => {
        handleCreateProvider(newProviderData);
        setModals(prev => {
            return { ...prev, manage: false };
        });
        setChoosedProvider(DEFAULT_PROVIDER);
    };

    const handleOnUpdateProvider = (newProviderData: IProvider) => {
        handleUpdateProvider(newProviderData);
        setModals(prev => {
            return { ...prev, manage: false };
        });
        setChoosedProvider(DEFAULT_PROVIDER);
    };

    const handleOnOpenManageProviderModal = (provider: IProvider) => {
        setChoosedProvider(provider);
        setModals(prev => {
            return { ...prev, manage: true };
        });
    };

    const handleOnCloseManageProviderModal = () => {
        setChoosedProvider(DEFAULT_PROVIDER);
        setModals(prev => {
            return { ...prev, manage: false };
        });
    };

    const handleOnOpenDeletingProviderModal = (provider: IProvider) => {
        setChoosedProvider(provider);
        setModals(prev => {
            return { ...prev, deleteConfirmation: true };
        });
    };

    const handleOnCloseDeletingProviderModal = () => {
        setChoosedProvider(DEFAULT_PROVIDER);
        setModals(prev => {
            return { ...prev, deleteConfirmation: false };
        });
    };

    const handleOnDeletingProviderApprove = () => {
        if (choosedProvider) {
            handleDeleteProvider(choosedProvider);
            handleOnCloseDeletingProviderModal();
        }
    };

    return (
        <ProvidersPageView
            providers={ providers }
            modals={ modals }
            choosedProvider={ choosedProvider }
            handleDeleteProvider={ handleOnDeletingProviderApprove }
            handleOnOpenDeletingProviderModal={ handleOnOpenDeletingProviderModal }
            handleOnCloseDeletingProviderModal={ handleOnCloseDeletingProviderModal }
            handleOnCloseManageProviderModal={ handleOnCloseManageProviderModal }
            handleOnOpenManageProviderModal={ handleOnOpenManageProviderModal }
            handleOnUpdateProvider={ handleOnUpdateProvider }
            handleOnCreateProvider={ handleOnCreateProvider }
        />
    );
}