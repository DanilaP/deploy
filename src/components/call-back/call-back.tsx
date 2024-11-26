import { useState } from "react";
import { useStore } from "../../stores";
import CallBackPageView from "./call-back-page-view/call-back.page-view";
import { ICallBack } from "../../interfaces/interfaces";
import CustomModal from "../../components-ui/custom-modal/custom-modal";
import { useTranslation } from "react-i18next";
import CallbackMoreInfo from "./call-back-more-info/call-back-more.info";
import { Button } from "@mui/material";
import CallBackForm, { ICallFormData } from "./call-back-form/call-back-form";
import { useCallbacksHelper } from "../../helpers/use-callbacks-helper";

export default function CallBackPage() {

    const { userStore } = useStore();
    const userId = userStore.user?.id;

    const {
        callbacks: userCallBacks,
        callbacksDataGrid: userCallbacksDataGrid,
        handleCreateNewUserCallBack
    } = useCallbacksHelper(userId ? userId : null);

    const [currentCallback, setCurrentCallback] = useState<ICallBack | null>(null);
    const [modals, setModals] = useState({ moreInfo: false, create: false, unsavedData: false });
    const [unsavedDataExists, setUnsavedDataExists] = useState<boolean>(false);

    const { t } = useTranslation();

    const handleOpenCallbackMoreInfo = (callbackId: number) => {
        const findedCallback = userCallBacks.find(el => el.id === callbackId);
        if (findedCallback) {
            setCurrentCallback(findedCallback);
            setModals(prev => {
                return { ...prev, moreInfo: true };
            });
        }
    };

    const handleCloseCallbackMoreInfo = () => {
        setCurrentCallback(null);
        setModals(prev => {
            return { ...prev, moreInfo: false };
        });
    };

    const handleOpenCreatingNewCallback = () => {
        setModals(prev => {
            return { ...prev, create: true };
        });
    };

    const handleCloseCreatingNewCallback = () => {
        if (unsavedDataExists) {
            setModals(prev => {
                return { ...prev, unsavedData: true };
            });
            return;
        }
        
        setModals(prev => {
            return { ...prev, create: false };
        });
    };

    const handleCreateNewCallback = (formData: ICallFormData) => {
        handleCreateNewUserCallBack(formData);
        setModals(prev => {
            return { ...prev, create: false };
        });
        setCurrentCallback(null);
    };

    const handleUpdateUnsavedDataExist = (unsavedDataExists: boolean) => {
        setUnsavedDataExists(unsavedDataExists);
    };

    const handleCancelCreatingCallback = () => {
        setCurrentCallback(null);
        setModals(prev => {
            return { ...prev, create: false, unsavedData: false };
        });
    };

    const handleCloseUnsavedDataModal = () => {
        setModals(prev => {
            return { ...prev, unsavedData: false };
        });
    };

    return (
        <>
            <CallBackPageView
                userCallbacksData={ userCallBacks }
                userCallbacksDataGrid={ userCallbacksDataGrid }
                handleOpenCallbackMoreInfo={ handleOpenCallbackMoreInfo }
                handleOpenCreatingNewCallback={ handleOpenCreatingNewCallback }
            />
            <CustomModal
                isDisplay={ modals.moreInfo }
                title={ t("text.callbackInfo") }
                typeOfActions='custom'
                actionConfirmed={ handleCloseCallbackMoreInfo }
                closeModal={ handleCloseCallbackMoreInfo }
                actionsComponent={
                    <Button variant="contained" onClick={ handleCloseCallbackMoreInfo }>{ t("text.close") }</Button>
                }
            >
                <CallbackMoreInfo
                    callback={ currentCallback }
                />
            </CustomModal>
            <CustomModal
                isHidden={ modals.unsavedData }
                isDisplay={ modals.create }
                title={ t("text.callbackInfo") }
                typeOfActions='none'
                actionConfirmed={ handleCloseCreatingNewCallback }
                closeModal={ handleCloseCreatingNewCallback }
            >
                <CallBackForm
                    handleCloseCreatingNewCallback={ handleCloseCreatingNewCallback }
                    handleSaveNewCallback={ handleCreateNewCallback }
                    handleUpdateUnsavedDataExist={ handleUpdateUnsavedDataExist }
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.unsavedData }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ handleCancelCreatingCallback }
                closeModal={ handleCancelCreatingCallback }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ handleCancelCreatingCallback }
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