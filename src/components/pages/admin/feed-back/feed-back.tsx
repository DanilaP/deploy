import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useFeedbacks } from "../../../../models/feedbacks/use-feedbacks";
import { IFeedBack } from "../../../../models/feedbacks/feedbacks";
import FeedBackAnswerForm from "./components/feed-back-answer-form/feed-back-answer-form";
import AdminFeedbackPageView from "./components/feed-back-page-view/feed-back-page-view";
import CustomModal from "../../../components-ui/custom-modal/custom-modal";

export default function AdminFeedbackPage() {

    const { 
        loading,
        feedbacks, 
        fitleredFeedbacksDataGrid,
        handleUpdateFeedbackData,
        handleFilterUserFeedbacksDataGridByStatus,
        handleSearchFeedbacksByAllFields
    } = useFeedbacks(null);
    
    const [choosedFeedback, setChoosedFeedback] = useState<IFeedBack | null>(null);
    const [choosedStatusFilter, setChoosedStatusFilter] = useState<boolean | null>(null);
    const [unsavedDataExists, setUnsavedDataExists] = useState<boolean>(false);
    const [modals, setModals] = useState({ answer: false, unsaved: false });
    const { t } = useTranslation();

    const handleOpenFeedbackAnswerModal = (feedbackId: number) => {
        const findedFeedback = feedbacks.find(el => el.id === feedbackId);
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
        handleSearchFeedbacksByAllFields(feedbacks, value);
    };

    useEffect(() => {
        if (choosedStatusFilter !== null) {
            handleFilterUserFeedbacksDataGridByStatus(choosedStatusFilter);
        }
    }, [feedbacks, choosedStatusFilter]);

    return (
        <>
            <AdminFeedbackPageView
                feedbacksDataGrid={ fitleredFeedbacksDataGrid }
                handleOpenFeedbackAsnwerModal={ handleOpenFeedbackAnswerModal }
                handleFilterUserFeedbacksDataGridByStatus={ handleFilterUserFeedbacksDataGridBySelectedStatus }
                handleSearchFeedbacksByInputValue={ handleSearchFeedbacksByInputValue }
            />
            <CustomModal
                isHidden={ modals.unsaved }
                isDisplay={ modals.answer }
                title={ t("text.feedbackAnswer") }
                typeOfActions='none'
                actionConfirmed={ handleCloseFeedbackAnswerModal }
                closeModal={ handleCloseFeedbackAnswerModal }
            >
                <FeedBackAnswerForm
                    currentFeedback={ choosedFeedback }
                    handleCloseFeedbackAsnwerModal={ handleCloseFeedbackAnswerModal }
                    handleUpdateCurrentFeedback={ handleUpdateFeedback }
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