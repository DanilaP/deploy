import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { validateRequiredField } from "../../../../../helpers/validators/validators-helper";
import { IFeedBack } from "../../../../../models/feedbacks/feedbacks";
import { useEffect } from "react";
import FileAttachment from "../../../../partials/file-attachment/file-attachment";
import FeedbackShortInfo from "../feed-back-short-info/feed-back-short-info";
import "./feed-back-answer-form.scss";
import formatDate from "../../../../../helpers/utils/format-date";

export interface IFeedbackAnswerData {
    answer: string
}

interface IFeedBackAnswerFormProps {
    currentFeedback: IFeedBack | null,
    currentFeedbackHistory: IFeedBack[],
    handleUpdateCurrentFeedback: (feedbackData: IFeedBack) => void,
    handleSwapCurrentFeedback: (feedback: IFeedBack) => void,
}
export default function FeedBackAnswerForm({
    currentFeedback,
    currentFeedbackHistory,
    handleUpdateCurrentFeedback,
    handleSwapCurrentFeedback
}: IFeedBackAnswerFormProps) {
    
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors , submitCount, isValid },
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

    const handleSortFeedbacksListByDate = (feedbacks: IFeedBack[]) => {
        return feedbacks.sort((prev: IFeedBack, next: IFeedBack) => {
            const prevDate = new Date(prev.createdAt);
            const nextDate = new Date(next.createdAt);
            if (prevDate < nextDate) return 1;
            return -1;
        });
    };

    useEffect(() => {
        if (!currentFeedback?.moderatorAnswer) {
            setValue("answer", "");
        } else {
            reset();
            setValue("answer", currentFeedback?.moderatorAnswer);
        }
    }, [currentFeedback?.moderatorAnswer]);

    return (
        <>
            <div className="current-call-back-data">
                <div className="name">
                    { currentFeedback?.firstName } { currentFeedback?.secondName } { currentFeedback?.phoneNumber }
                </div>
                <div className="type">{ t(`typesOfFeedbacks.${currentFeedback?.typeOfBid || ""}`) }</div>
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
                </div>
            </div>
            <form className="call-back-answer-form" onSubmit={ handleSubmit(handleSendAnswerForFeedback) }>
                <FormControl>
                    <FormLabel className="label">
                        { t("text.answer") } 
                    </FormLabel>
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
                <div className="form-actions">
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={ submitCount !== 0 && !isValid || Boolean(currentFeedback?.moderatorAnswer) }
                    >{ t("text.sendAnswer") }</Button>
                </div>
                <div className="answer-history">
                    <div className="answer-history-title">
                        { t("text.historyOfAnswers") }
                    </div>
                    <div className="answer-history-content">
                        {
                            handleSortFeedbacksListByDate(currentFeedbackHistory).map(feedback => {
                                const isSelected = currentFeedback?.id === feedback.id;
                                return (
                                    <FeedbackShortInfo
                                        key={ feedback.id }
                                        isSelected={ isSelected }
                                        feedback={ feedback }
                                        handleSwapCurrentFeedback={ handleSwapCurrentFeedback }
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            </form>
        </>
    );
}