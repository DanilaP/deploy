import { useEffect, useState } from "react";
import { useCallbacksHelper } from "../../../helpers/use-callbacks-helper";
import AdminCallbackPageView from "./call-back-page-view/call-back-page-view";
import { ICallBack } from "../../../interfaces/interfaces";
import CustomModal from "../../../components-ui/custom-modal/custom-modal";
import { useTranslation } from "react-i18next";

export default function AdminCallbackPage() {

    const { 
        loading,
        callbacks, 
        fitleredCallbacksDataGrid,
        handleUpdateCallbackData,
        handleFilterUserCallbacksDataGridByStatus
    } = useCallbacksHelper(null);
    
    const [choosedCallback, setChoosedCallback] = useState<ICallBack | null>(null);
    const [choosedStatusFilter, setChoosedStatusFilter] = useState<boolean | null>(null);
    const [modals, setModals] = useState({ answer: false });
    const { t } = useTranslation();

    const handleOpenCallbackAsnwerModal = (callbackId: number) => {
        const findedCallback = callbacks.find(el => el.id === callbackId);
        if (findedCallback) {
            setChoosedCallback(findedCallback || null);
            setModals(prev => {
                return { ...prev, answer: true };
            });
        }
    };

    const handleCloseCallbackAsnwerModal = () => {
        setChoosedCallback(null);
        setModals(prev => {
            return { ...prev, answer: false };
        });
    };

    const handleUpdateCallback = (updatedCallback: ICallBack) => {
        handleUpdateCallbackData(updatedCallback);
        setModals(prev => {
            return { ...prev, answer: false };
        });
    };

    const handleFilterUserCallbacksDataGridBySelectedStatus = (status: boolean) => {
        setChoosedStatusFilter(status);
    };

    useEffect(() => {
        if (choosedStatusFilter !== null) {
            handleFilterUserCallbacksDataGridByStatus(choosedStatusFilter);
        }
    }, [callbacks, choosedStatusFilter]);

    return (
        <>
            <AdminCallbackPageView
                callbacksDataGrid={ fitleredCallbacksDataGrid }
                handleOpenCallbackAsnwerModal={ handleOpenCallbackAsnwerModal }
                handleFilterUserCallbacksDataGridByStatus={ handleFilterUserCallbacksDataGridBySelectedStatus }
            />
            <CustomModal 
                isDisplay={ modals.answer }
                title={ t("text.callbackAnswer") }
                typeOfActions='none'
                actionConfirmed={ handleCloseCallbackAsnwerModal }
                closeModal={ handleCloseCallbackAsnwerModal }
            >
                Form
            </CustomModal>
        </>
    );
}