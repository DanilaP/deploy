import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { validateRequiredField } from "../../../../../../helpers/validators/validators-helper";
import { useEffect } from "react";
import { IFeedBack } from "../../../../../../models/feedbacks/feedbacks";
import FileAttachment from "../../../../../partials/file-attachment/file-attachment";
import "./feed-back-answer-form.scss";

export interface IFeedbackAnswerData {
    answer: string
}

interface IFeedBackAnswerFormProps {
    currentFeedback: IFeedBack | null,
    handleCloseFeedbackAsnwerModal: () => void,
    handleUpdateCurrentFeedback: (feedbackData: IFeedBack) => void,
    handleUpdateUnsavedDataExists: (isDirty: boolean) => void
}
export default function FeedBackAnswerForm({
    currentFeedback,
    handleCloseFeedbackAsnwerModal,
    handleUpdateCurrentFeedback,
    handleUpdateUnsavedDataExists
}: IFeedBackAnswerFormProps) {

    const {
        register,
        handleSubmit,
        formState: { errors , submitCount, isValid, isDirty },
    } = useForm<IFeedbackAnswerData>({
        defaultValues: {
            answer: currentFeedback?.moderatorAnswer || ""
        }
    });

    const { t } = useTranslation();

    const handleSendAnswerForFeedback = (data: IFeedbackAnswerData) => {
        const date = new Date();
        if (currentFeedback) {
            handleUpdateCurrentFeedback({
                ...currentFeedback,
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
                <div className="name">{ currentFeedback?.firstName } { currentFeedback?.secondName } { currentFeedback?.phoneNumber }</div>
                <div className="type">{ currentFeedback?.typeOfBid }</div>
                <div className="description">{ currentFeedback?.description }</div>
                <div className="attachments">
                    <div className="files">
                        {
                            currentFeedback?.attachments.map(attachment => {
                                return (
                                    <FileAttachment
                                        key={ attachment.src }
                                        attachment={ attachment }
                                    />
                                );
                            })
                        }
                    </div>
                    <div className="date">{ currentFeedback?.createdAt }</div>
                </div>
            </div>
            <form className="call-back-answer-form" onSubmit={ handleSubmit(handleSendAnswerForFeedback) }>
                <FormControl>
                    <FormLabel className="label">{ t("text.answer") }</FormLabel>
                    <TextField
                        disabled={ Boolean(currentFeedback?.moderatorAnswer) }
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
                <div className="answer-date">{ currentFeedback?.dateOfAnswer }</div>
                <div className="form-actions">
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={ submitCount !== 0 && !isValid || Boolean(currentFeedback?.moderatorAnswer) }
                    >{ t("text.sendAnswer") }</Button>
                    <Button 
                        variant="contained" 
                        onClick={ handleCloseFeedbackAsnwerModal }
                    >{ t("text.close") }</Button>
                </div>
            </form>
        </>
    );
}