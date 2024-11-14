import { useState } from "react";
import { useProvidersHelper } from "../../../helpers/use-providers-helper";
import ProvidersPageView from "./providers-page-view/providersPageView";
import { IProvider } from "../../../interfaces/interfaces";
import { DEFAULT_PROVIDER } from "./constants";

export default function ProvidersPage() {
    
    const { 
        filteredProviders,
        handleDeleteProvider,
        handleUpdateProvider,
        handleCreateProvider,
        handleSearchProvidersByAllFields
    } = useProvidersHelper();

    const [modals, setModals] = useState({ manage: false, deleteConfirmation: false, unsavedData: false });
    const [choosedProvider, setChoosedProvider] = useState<IProvider>(DEFAULT_PROVIDER);
    const [formUnsavedDataExist, setFormUnsavedDataExist] = useState<boolean>(false);

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
        if (formUnsavedDataExist) {
            setModals(prev => {
                return { ...prev, unsavedData: true };
            });
        } else {
            setChoosedProvider(DEFAULT_PROVIDER);
            setModals(prev => {
                return { ...prev, manage: false, unsavedData: false };
            });
        }
    };

    const handleCloseManageModalWithUnSavedData = () => {
        setChoosedProvider(DEFAULT_PROVIDER);
        setModals(prev => {
            return { ...prev, manage: false, unsavedData: false };
        });
    };

    const handleOnOpenDeletingProviderModal = (e: any, provider: IProvider) => {
        e.stopPropagation();
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

    const handleSetUnsavedChangesExist = (status: boolean) => {
        setFormUnsavedDataExist(status);
    };

    const handleCloseUnsavedDataModal = () => {
        setModals(prev => {
            return { ...prev, unsavedData: false };
        });
    };

    return (
        <ProvidersPageView
            providers={ filteredProviders }
            modals={ modals }
            choosedProvider={ choosedProvider }
            handleSearchProvidersByAllFields={ handleSearchProvidersByAllFields }
            handleDeleteProvider={ handleOnDeletingProviderApprove }
            handleOnOpenDeletingProviderModal={ handleOnOpenDeletingProviderModal }
            handleOnCloseDeletingProviderModal={ handleOnCloseDeletingProviderModal }
            handleOnCloseManageProviderModal={ handleOnCloseManageProviderModal }
            handleOnOpenManageProviderModal={ handleOnOpenManageProviderModal }
            handleOnUpdateProvider={ handleOnUpdateProvider }
            handleOnCreateProvider={ handleOnCreateProvider }
            handleSetUnsavedChangesExist={ handleSetUnsavedChangesExist }
            handleCloseUnsavedDataModal={ handleCloseUnsavedDataModal }
            handleCloseManageModalWithUnSavedData={ handleCloseManageModalWithUnSavedData }
        />
    );
}