import { ReactChild } from "react";
import "./custom-modal.scss";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

const CustomModal = (props: {
    children: ReactChild, 
    isDisplay: boolean, 
    closeModal: (status: boolean) => void
    actionConfirmed?: (status: boolean) => void,
    title: string,
    typeOfActions: "default" | "none" | "custom"
    actionsComponent?: any,
}): JSX.Element | null => {

    const { t } = useTranslation();

    if(!props.isDisplay) {
        return null;
    }
    return(
        <div className={ "custom-modal" }>
            <div className={ `${ "custom-modal-content" }` }>
                <div className={ "custom-modal-title" }>
                    <p>{ t(props.title) }</p>
                </div>
                <div className={ "custom-modal-children-content" }>
                    { props.children }
                </div>
                <div className={ "manage-custom-modal" }>
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