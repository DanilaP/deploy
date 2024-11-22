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
        userCallBacks,
        userCallbacksDataGrid,
        handleCreateNewUserCallBack
    } = useCallbacksHelper(userId ? userId : null);

    const [currentCallback, setCurrentCallback] = useState<ICallBack | null>(null);
    const [modals, setModals] = useState({ moreInfo: false, create: false });

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
        setCurrentCallback(null);
        setModals(prev => {
            return { ...prev, create: false };
        });
    };

    const handleCreateNewCallback = (formData: ICallFormData) => {
        handleCreateNewUserCallBack(formData);
        handleCloseCreatingNewCallback();
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
                isDisplay={ modals.create }
                title={ t("text.callbackInfo") }
                typeOfActions='none'
                actionConfirmed={ handleCloseCreatingNewCallback }
                closeModal={ handleCloseCreatingNewCallback }
            >
                <CallBackForm
                    handleCloseCreatingNewCallback={ handleCloseCreatingNewCallback }
                    handleSaveNewCallback={ handleCreateNewCallback }
                />
            </CustomModal>
        </>
    ); 
}