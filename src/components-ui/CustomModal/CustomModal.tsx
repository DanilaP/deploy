import { ReactChild } from "react";
import "./CustomModal.scss";
import { useTranslation } from "react-i18next";

const CustomModal = (props: {
    children: ReactChild, 
    isDisplay: boolean, 
    closeModal: (status: boolean) => void
    actionConfirmed: (status: boolean) => void,
    title: string,
    typeOfActions: "default" | "none" | "custom"
    actionsComponent?: any,
}): JSX.Element | null => {

    const { t } = useTranslation();

    if(!props.isDisplay) {
        return null;
    }
    return(
        <div className={ "customModal" }>
            <div className={`${ "customModalContent" }`}>
                <div className={ "customModalTitle" }>
                    <p>{t(props.title)}</p>
                </div>
                <div className={ "customModalChildrenContent" }>
                    {props.children}
                </div>
                <div className={ "manageCustomModal" }>
                    { 
                        props.typeOfActions === "default" 
                        &&
                        <>
                            <button className={ "confirmBtn" } onClick={() => props.actionConfirmed(true)}>{t("Подтвердить")}</button>
                            <button className={ "cancelBtn" } onClick={() => props.closeModal(false)}>{t("Закрыть")}</button>
                        </>
                    }
                    {
                        props.typeOfActions === "custom"
                        &&
                        { ...props.actionsComponent }
                    }
                    {
                        props.typeOfActions === "none"
                        &&
                        null
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomModal;