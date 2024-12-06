import { useState } from "react";
import { useStore } from "../../../stores";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { useFeedbacks } from "../../../models/feedbacks/use-feedbacks";
import { IFeedBack } from "../../../models/feedbacks/feedbacks";
import FeedBackForm, { IFeedFormData } from "./components/feed-back-form/feed-back-form";
import FeedBackPageView from "./components/feed-back-page-view/feed-back.page-view";
import CustomModal from "../../components-ui/custom-modal/custom-modal";
import FeedbackMoreInfo from "./components/feed-back-more-info/feed-back-more.info";

export default function FeedBackPage() {

    const { userStore } = useStore();
    const userId = userStore.user?.id;

    const {
        feedbacks: userFeedBacks,
        feedbacksDataGrid: userFeedbacksDataGrid,
        handleCreateNewUserFeedBack,
        handleUpdateFeedbackData,
        handleDeleteFeedbackById
    } = useFeedbacks(userId ? userId : null);

    const [currentFeedback, setCurrentFeedback] = useState<IFeedBack | null>(null);
    const [mode, setMode] = useState<"create" | "edit" | null>(null);
    const [modals, setModals] = useState({ 
        moreInfo: false, 
        manage: false, 
        unsavedData: false,
        confirmDeleting: false
    });
    const [unsavedDataExists, setUnsavedDataExists] = useState<boolean>(false);

    const { t } = useTranslation();

    const handleOpenFeedbackMoreInfo = (feedbackId: number) => {
        const findedFeedback = userFeedBacks.find(el => el.id === feedbackId);
        if (findedFeedback) {
            setCurrentFeedback(findedFeedback);
            setModals(prev => {
                return { ...prev, moreInfo: true };
            });
        }
    };

    const handleCloseFeedbackMoreInfo = () => {
        setCurrentFeedback(null);
        setModals(prev => {
            return { ...prev, moreInfo: false };
        });
    };

    const handleOpenCreatingNewFeedback = () => {
        setMode("create");
        setModals(prev => {
            return { ...prev, manage: true };
        });
    };

    const handleOpenEditFeedbackModal = (feedbackId: number) => {
        const findedFeedback = userFeedBacks.find(el => el.id === feedbackId);
        if (findedFeedback) {
            setCurrentFeedback(findedFeedback);
            setMode("edit");
            setModals(prev => {
                return { ...prev, manage: true };
            });
        }
    };

    const handleOpenDeleteFeedbackModal = (feedbackId: number) => {
        const findedFeedback = userFeedBacks.find(el => el.id === feedbackId);
        if (findedFeedback) {
            setCurrentFeedback(findedFeedback);
            setModals(prev => {
                return { ...prev, confirmDeleting: true };
            });
        }
    };

    const handleCloseDeleteFeedbackModal = () => {
        setCurrentFeedback(null);
        setModals(prev => {
            return { ...prev, confirmDeleting: false };
        });
    };

    const handleConfirmDeletingFeedbackModal = () => {
        if (currentFeedback) {
            handleDeleteFeedbackById(currentFeedback);
            setCurrentFeedback(null);
            setModals(prev => {
                return { ...prev, confirmDeleting: false };
            });
        }
    };


    const handleCloseCreatingNewFeedback = () => {
        if (unsavedDataExists) {
            setModals(prev => {
                return { ...prev, unsavedData: true };
            });
            return;
        }
        setModals(prev => {
            return { ...prev, manage: false };
        });
        setMode(null);
    };

    const handleCreateNewFeedback = (formData: IFeedFormData) => {
        handleCreateNewUserFeedBack(formData);
        setModals(prev => {
            return { ...prev, manage: false };
        });
        setMode(null);
        setCurrentFeedback(null);
    };

    const handleEditCurrentFeedback = (feedbackData: IFeedFormData) => {
        if (currentFeedback?.userId) {
            handleUpdateFeedbackData({
                ...currentFeedback,
                ...feedbackData
            });
            setModals(prev => {
                return { ...prev, manage: false };
            });
            setMode(null);
            setCurrentFeedback(null);
        }
    };

    const handleUpdateUnsavedDataExist = (unsavedDataExists: boolean) => {
        setUnsavedDataExists(unsavedDataExists);
    };

    const handleCancelCreatingFeedback = () => {
        setCurrentFeedback(null);
        setModals(prev => {
            return { ...prev, manage: false, unsavedData: false };
        });
        setMode(null);
    };

    const handleCloseUnsavedDataModal = () => {
        setModals(prev => {
            return { ...prev, unsavedData: false };
        });
    };

    return (
        <>
            <FeedBackPageView
                userFeedbacksData={ userFeedBacks }
                userFeedbacksDataGrid={ userFeedbacksDataGrid }
                handleOpenFeedbackMoreInfo={ handleOpenFeedbackMoreInfo }
                handleOpenCreatingNewFeedback={ handleOpenCreatingNewFeedback }
                handleOpenEditFeedbackModal={ handleOpenEditFeedbackModal }
                handleOpenDeleteFeedbackModal={ handleOpenDeleteFeedbackModal }
            />
            <CustomModal
                isDisplay={ modals.moreInfo }
                title={ t("text.feedbackInfo") }
                typeOfActions='custom'
                actionConfirmed={ handleCloseFeedbackMoreInfo }
                closeModal={ handleCloseFeedbackMoreInfo }
                actionsComponent={
                    <Button variant="contained" onClick={ handleCloseFeedbackMoreInfo }>{ t("text.close") }</Button>
                }
            >
                <FeedbackMoreInfo
                    feedback={ currentFeedback }
                />
            </CustomModal>
            <CustomModal
                isHidden={ modals.unsavedData }
                isDisplay={ modals.manage }
                title={ mode === "create"
                    ? t("text.createFeedback") 
                    : t("text.editFeedback")
                }
                typeOfActions='none'
                actionConfirmed={ handleCloseCreatingNewFeedback }
                closeModal={ handleCloseCreatingNewFeedback }
            >
                <FeedBackForm
                    mode={ mode }
                    currentFeedback={ currentFeedback }
                    handleCloseCreatingNewFeedback={ handleCloseCreatingNewFeedback }
                    handleSaveNewFeedback={ handleCreateNewFeedback }
                    handleUpdateUnsavedDataExist={ handleUpdateUnsavedDataExist }
                    handleEditCurrentFeedback={ handleEditCurrentFeedback }
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.unsavedData }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ handleCancelCreatingFeedback }
                closeModal={ handleCancelCreatingFeedback }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ handleCancelCreatingFeedback }
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
            <CustomModal 
                isDisplay={ modals.confirmDeleting }
                title={ t("text.deleteFeedback") }
                typeOfActions='default'
                actionConfirmed={ handleConfirmDeletingFeedbackModal }
                closeModal={ handleCloseDeleteFeedbackModal }
            >
                <div className="delete-text">{ t("text.approveDeletingFeedback") }?</div>
            </CustomModal>
        </>
    ); 
}