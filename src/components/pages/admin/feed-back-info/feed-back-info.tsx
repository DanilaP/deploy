import { useNavigate, useParams } from "react-router";
import { useFeedbacks } from "../../../../models/feedbacks/use-feedbacks";
import { useEffect, useState } from "react";
import { IFeedBack } from "../../../../models/feedbacks/feedbacks";
import FeedBackAnswerForm from "./feed-back-answer-form/feed-back-answer-form";

export const FeedBackInfoPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        feedbacks,
        handleUpdateFeedbackData,
        handleSearchNextFeedbacksForFeedback,
        handleSearchChildrenFeedbacksForFeedback
    } = useFeedbacks(null);

    const [currentFeedback, setCurrentFeedback] = useState<IFeedBack | null>(null);
    const [currentFeedbackHistory, setCurrentFeedbackHistory] = useState<IFeedBack[]>([]);

    const handleSwapCurrentFeedback = (feedback: IFeedBack) => {
        navigate(`/admin/feedback/${feedback.id}`);
    };

    useEffect(() => {
        const numberedId = Number(id);
        if (numberedId) {
            setCurrentFeedback(feedbacks.find(el => el.id === numberedId) || null);
        }
    }, [feedbacks, id]);

    useEffect(() => {
        if (currentFeedback) {
            setCurrentFeedbackHistory(
                [
                    ...handleSearchNextFeedbacksForFeedback(currentFeedback),
                    ...handleSearchChildrenFeedbacksForFeedback(currentFeedback),
                    currentFeedback
                ]
            );
        }
    }, [currentFeedback]);

    if (currentFeedback) {
        return (
            <FeedBackAnswerForm
                currentFeedback={ currentFeedback }
                currentFeedbackHistory={ currentFeedbackHistory }
                handleUpdateCurrentFeedback={ handleUpdateFeedbackData }
                handleSwapCurrentFeedback={ handleSwapCurrentFeedback }
            />
        );
    }
};
