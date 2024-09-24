import { ReactChild } from "react";
import "./custom-modal.scss";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

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
                    <p>{ t(props.title) }</p>
                </div>
                <div className={ "customModalChildrenContent" }>
                    { props.children }
                </div>
                <div className={ "manageCustomModal" }>
                    { 
                        props.typeOfActions === "default" 
                        &&
                        <>
                            <Button onClick={() => props.actionConfirmed(true)} variant="contained">{ t("Подтвердить") }</Button>
                            <Button onClick={() => props.closeModal(false)} variant="contained">{ t("Закрыть") }</Button>
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