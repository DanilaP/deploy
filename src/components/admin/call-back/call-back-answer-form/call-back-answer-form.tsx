import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { validateRequiredField } from "../../../../helpers/validators-helper";
import { ICallBack } from "../../../../interfaces/interfaces";
import "./call-back-answer-form.scss";
import { useEffect } from "react";

export interface ICallbackAnswerData {
    answer: string
}

interface ICallBackAnswerFormProps {
    currentCallback: ICallBack | null,
    handleCloseCallbackAsnwerModal: () => void,
    handleUpdateCurrentCallback: (callbackData: ICallBack) => void,
    handleUpdateUnsavedDataExists: (isDirty: boolean) => void
}
export default function CallBackAnswerForm({
    currentCallback,
    handleCloseCallbackAsnwerModal,
    handleUpdateCurrentCallback,
    handleUpdateUnsavedDataExists
}: ICallBackAnswerFormProps) {

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors , submitCount, isValid, isDirty },
    } = useForm<ICallbackAnswerData>({
        defaultValues: {
            answer: currentCallback?.moderatorAnswer || ""
        }
    });

    const { t } = useTranslation();

    const handleSendAnswerForCallback = (data: ICallbackAnswerData) => {
        const date = new Date();
        if (currentCallback) {
            handleUpdateCurrentCallback({
                ...currentCallback,
                moderatorAnswer: data.answer,
                dateOfAnswer: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
                solved: true,
            });   
        }
    };

    useEffect(() => {
        handleUpdateUnsavedDataExists(isDirty);
    }, [isDirty]);

    return (
        <>
            <div className="current-call-back-data">
                <div className="name">{ currentCallback?.firstName } { currentCallback?.secondName } ({ currentCallback?.phoneNumber })</div>
                <div className="type">{ currentCallback?.typeOfBid }</div>
                <div className="description">{ currentCallback?.description }</div>
                <div className="date">{ currentCallback?.dateOfCreation }</div>
            </div>
            <form className="call-back-answer-form" onSubmit={ handleSubmit(handleSendAnswerForCallback) }>
                <FormControl>
                    <FormLabel className="label">{ t("text.answer") }</FormLabel>
                    <TextField
                        disabled={ Boolean(currentCallback?.moderatorAnswer) }
                        multiline
                        minRows={ 2 }
                        maxRows={ 2 }
                        error={ Boolean(errors.answer) }
                        helperText={ String(errors.answer?.message || "") }
                        placeholder={ t("text.answer") }
                        { ...register("answer", { 
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                    />
                </FormControl>
                <div className="form-actions">
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={ submitCount !== 0 && !isValid || Boolean(currentCallback?.moderatorAnswer) }
                    >{ t("text.sendAnswer") }</Button>
                    <Button 
                        variant="contained" 
                        onClick={ handleCloseCallbackAsnwerModal }
                    >{ t("text.close") }</Button>
                </div>
            </form>
        </>
    );
}