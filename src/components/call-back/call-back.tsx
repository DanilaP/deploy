import { useEffect, useState } from "react";
import { useStore } from "../../stores";
import $api from '../../configs/axiosconfig/axios';
import CallBackPageView from "./call-back-page-view/call-back.page-view";
import { ICallBack } from "../../interfaces/interfaces";
import CustomModal from "../../components-ui/custom-modal/custom-modal";
import { useTranslation } from "react-i18next";
import CallbackMoreInfo from "./call-back-more-info/call-back-more.info";
import { Button } from "@mui/material";
import CallBackForm from "./call-back-form/call-back-form";

export default function CallBackPage() {

    const { userStore } = useStore();
    const userId = userStore.user?.id;

    const [userCallbacksData, setUserCallbacksData] = useState<ICallBack[]>([]);
    const [currentCallback, setCurrentCallback] = useState<ICallBack | null>(null);
    const [modals, setModals] = useState({ moreInfo: false, create: false });

    const { t } = useTranslation();

    const handleOpenCallbackMoreInfo = (callback: ICallBack) => {
        setCurrentCallback(callback);
        setModals(prev => {
            return { ...prev, moreInfo: true };
        });
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

    useEffect(() => {
        $api.get(`/callbacks?userId=${userId}`)
            .then(res => {
                if (res.data.callbacks) {
                    setUserCallbacksData(res.data.callbacks);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [userId]);

    return (
        <>
            <CallBackPageView
                userCallbacksData={ userCallbacksData }
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
                />
            </CustomModal>
        </>
    ); 
}