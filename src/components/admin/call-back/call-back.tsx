import { useEffect, useState } from "react";
import { useCallbacksHelper } from "../../../helpers/use-callbacks-helper";
import AdminCallbackPageView from "./call-back-page-view/call-back-page-view";
import { ICallBack } from "../../../interfaces/interfaces";
import CustomModal from "../../../components-ui/custom-modal/custom-modal";
import { useTranslation } from "react-i18next";
import CallBackAnswerForm from "./call-back-answer-form/call-back-answer-form";
import { Button } from "@mui/material";

export default function AdminCallbackPage() {

    const { 
        loading,
        callbacks, 
        fitleredCallbacksDataGrid,
        handleUpdateCallbackData,
        handleFilterUserCallbacksDataGridByStatus,
        handleSearchCallbacksByAllFields
    } = useCallbacksHelper(null);
    
    const [choosedCallback, setChoosedCallback] = useState<ICallBack | null>(null);
    const [choosedStatusFilter, setChoosedStatusFilter] = useState<boolean | null>(null);
    const [unsavedDataExists, setUnsavedDataExists] = useState<boolean>(false);
    const [modals, setModals] = useState({ answer: false, unsaved: false });
    const { t } = useTranslation();

    const handleOpenCallbackAnswerModal = (callbackId: number) => {
        const findedCallback = callbacks.find(el => el.id === callbackId);
        if (findedCallback) {
            setChoosedCallback(findedCallback || null);
            setModals(prev => {
                return { ...prev, answer: true };
            });
        }
    };

    const handleCloseCallbackAnswerModal = () => {
        if (unsavedDataExists) {
            setModals(prev => {
                return { ...prev, unsaved: true };
            });
            return;
        }
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

    const handleUpdateUnsavedDataExists = (unsavedDataExists: boolean) => {
        setUnsavedDataExists(unsavedDataExists);
    };

    const handleCancelAnsweringCallback = () => {
        setChoosedCallback(null);
        setModals(prev => {
            return { ...prev, answer: false, unsaved: false };
        });
    };

    const handleCloseUnsavedDataModal = () => {
        setModals(prev => {
            return { ...prev, unsaved: false };
        });
    };

    const handleSearchCallbacksByInputValue = (value: string) => {
        handleSearchCallbacksByAllFields(callbacks, value);
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
                handleOpenCallbackAsnwerModal={ handleOpenCallbackAnswerModal }
                handleFilterUserCallbacksDataGridByStatus={ handleFilterUserCallbacksDataGridBySelectedStatus }
                handleSearchCallbacksByInputValue={ handleSearchCallbacksByInputValue }
            />
            <CustomModal
                isHidden={ modals.unsaved }
                isDisplay={ modals.answer }
                title={ t("text.callbackAnswer") }
                typeOfActions='none'
                actionConfirmed={ handleCloseCallbackAnswerModal }
                closeModal={ handleCloseCallbackAnswerModal }
            >
                <CallBackAnswerForm
                    currentCallback={ choosedCallback }
                    handleCloseCallbackAsnwerModal={ handleCloseCallbackAnswerModal }
                    handleUpdateCurrentCallback={ handleUpdateCallback }
                    handleUpdateUnsavedDataExists={ handleUpdateUnsavedDataExists }
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.unsaved }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ handleCancelAnsweringCallback }
                closeModal={ handleCancelAnsweringCallback }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ handleCancelAnsweringCallback }
                        >{ t("text.close") }</Button>
                        <Button
                            onClick={ handleCloseUnsavedDataModal }
                            variant="contained"
                        >{ t("text.cancel") }</Button>
                    </>
                }
            >
                <div className="delete-text">{ t("text.unsavedChanges") }?</div>
            </CustomModal>
        </>
    );
}