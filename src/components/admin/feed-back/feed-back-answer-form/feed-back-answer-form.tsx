import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { validateRequiredField } from "../../../../helpers/validators-helper";
import { IFeedBack } from "../../../../interfaces/interfaces";
import "./feed-back-answer-form.scss";
import { useEffect } from "react";

export interface IFeedbackAnswerData {
    answer: string
}

interface IFeedBackAnswerFormProps {
    currentCallback: IFeedBack | null,
    handleCloseCallbackAsnwerModal: () => void,
    handleUpdateCurrentCallback: (callbackData: IFeedBack) => void,
    handleUpdateUnsavedDataExists: (isDirty: boolean) => void
}
export default function FeedBackAnswerForm({
    currentCallback,
    handleCloseCallbackAsnwerModal,
    handleUpdateCurrentCallback,
    handleUpdateUnsavedDataExists
}: IFeedBackAnswerFormProps) {

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors , submitCount, isValid, isDirty },
    } = useForm<IFeedbackAnswerData>({
        defaultValues: {
            answer: currentCallback?.moderatorAnswer || ""
        }
    });

    const { t } = useTranslation();

    const handleSendAnswerForCallback = (data: IFeedbackAnswerData) => {
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
                <div className="name">{ currentCallback?.firstName } { currentCallback?.secondName } { currentCallback?.phoneNumber }</div>
                <div className="type">{ currentCallback?.typeOfBid }</div>
                <div className="description">{ currentCallback?.description }</div>
                <div className="date">{ currentCallback?.createdAt }</div>
            </div>
            <hr />
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
                <div className="answer-date">{ currentCallback?.dateOfAnswer }</div>
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