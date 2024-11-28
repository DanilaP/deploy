import { useEffect, useState } from "react";
import { useFeedbacksHelper } from "../../../helpers/use-feedbacks-helper";
import AdminFeedbackPageView from "./feed-back-page-view/feed-back-page-view";
import { IFeedBack } from "../../../interfaces/interfaces";
import CustomModal from "../../../components-ui/custom-modal/custom-modal";
import { useTranslation } from "react-i18next";
import FeedBackAnswerForm from "./feed-back-answer-form/feed-back-answer-form";
import { Button } from "@mui/material";

export default function AdminFeedbackPage() {

    const { 
        loading,
        callbacks, 
        fitleredCallbacksDataGrid,
        handleUpdateFeedbackData,
        handleFilterUserFeedbacksDataGridByStatus,
        handleSearchFeedbacksByAllFields
    } = useFeedbacksHelper(null);
    
    const [choosedFeedback, setChoosedFeedback] = useState<IFeedBack | null>(null);
    const [choosedStatusFilter, setChoosedStatusFilter] = useState<boolean | null>(null);
    const [unsavedDataExists, setUnsavedDataExists] = useState<boolean>(false);
    const [modals, setModals] = useState({ answer: false, unsaved: false });
    const { t } = useTranslation();

    const handleOpenFeedbackAnswerModal = (feedbackId: number) => {
        const findedFeedback = callbacks.find(el => el.id === feedbackId);
        if (findedFeedback) {
            setChoosedFeedback(findedFeedback || null);
            setModals(prev => {
                return { ...prev, answer: true };
            });
        }
    };

    const handleCloseFeedbackAnswerModal = () => {
        if (unsavedDataExists) {
            setModals(prev => {
                return { ...prev, unsaved: true };
            });
            return;
        }
        setChoosedFeedback(null);
        setModals(prev => {
            return { ...prev, answer: false };
        });
    };

    const handleUpdateFeedback = (updatedFeedback: IFeedBack) => {
        handleUpdateFeedbackData(updatedFeedback);
        setModals(prev => {
            return { ...prev, answer: false };
        });
    };

    const handleFilterUserFeedbacksDataGridBySelectedStatus = (status: boolean) => {
        setChoosedStatusFilter(status);
    };

    const handleUpdateUnsavedDataExists = (unsavedDataExists: boolean) => {
        setUnsavedDataExists(unsavedDataExists);
    };

    const handleCancelAnsweringFeedback = () => {
        setChoosedFeedback(null);
        setModals(prev => {
            return { ...prev, answer: false, unsaved: false };
        });
    };

    const handleCloseUnsavedDataModal = () => {
        setModals(prev => {
            return { ...prev, unsaved: false };
        });
    };

    const handleSearchFeedbacksByInputValue = (value: string) => {
        handleSearchFeedbacksByAllFields(callbacks, value);
    };

    useEffect(() => {
        if (choosedStatusFilter !== null) {
            handleFilterUserFeedbacksDataGridByStatus(choosedStatusFilter);
        }
    }, [callbacks, choosedStatusFilter]);

    return (
        <>
            <AdminFeedbackPageView
                callbacksDataGrid={ fitleredCallbacksDataGrid }
                handleOpenCallbackAsnwerModal={ handleOpenFeedbackAnswerModal }
                handleFilterUserCallbacksDataGridByStatus={ handleFilterUserFeedbacksDataGridBySelectedStatus }
                handleSearchCallbacksByInputValue={ handleSearchFeedbacksByInputValue }
            />
            <CustomModal
                isHidden={ modals.unsaved }
                isDisplay={ modals.answer }
                title={ t("text.callbackAnswer") }
                typeOfActions='none'
                actionConfirmed={ handleCloseFeedbackAnswerModal }
                closeModal={ handleCloseFeedbackAnswerModal }
            >
                <FeedBackAnswerForm
                    currentCallback={ choosedFeedback }
                    handleCloseCallbackAsnwerModal={ handleCloseFeedbackAnswerModal }
                    handleUpdateCurrentCallback={ handleUpdateFeedback }
                    handleUpdateUnsavedDataExists={ handleUpdateUnsavedDataExists }
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.unsaved }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ handleCancelAnsweringFeedback }
                closeModal={ handleCancelAnsweringFeedback }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ handleCancelAnsweringFeedback }
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