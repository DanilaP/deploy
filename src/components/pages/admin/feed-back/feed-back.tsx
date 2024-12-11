import { useEffect, useState } from "react";
import { useFeedbacks } from "../../../../models/feedbacks/use-feedbacks";
import { useNavigate } from "react-router";
import AdminFeedbackPageView from "./components/feed-back-page-view/feed-back-page-view";

export default function AdminFeedbackPage() {

    const { 
        feedbacks, 
        fitleredFeedbacksDataGrid,
        handleFilterUserFeedbacksDataGridByStatus,
        handleSearchFeedbacksByAllFields
    } = useFeedbacks(null);
    
    const [choosedStatusFilter, setChoosedStatusFilter] = useState<boolean | null>(null);
    const navigate = useNavigate();

    const handleOpenFeedbackAnswerModal = (feedbackId: number) => {
        const findedFeedback = feedbacks.find(el => el.id === feedbackId);
        if (findedFeedback) {
            navigate(`./${findedFeedback.id}`);
        }
    };

    const handleSearchFeedbacksByInputValue = (value: string) => {
        handleSearchFeedbacksByAllFields(feedbacks, value);
    };

    const handleFilterUserFeedbacksDataGridBySelectedStatus = (status: boolean) => {
        setChoosedStatusFilter(status);
    };

    useEffect(() => {
        if (choosedStatusFilter !== null) {
            handleFilterUserFeedbacksDataGridByStatus(choosedStatusFilter);
        }
    }, [feedbacks, choosedStatusFilter]);

    return (
        <AdminFeedbackPageView
            feedbacksDataGrid={ fitleredFeedbacksDataGrid }
            handleOpenFeedbackAsnwerModal={ handleOpenFeedbackAnswerModal }
            handleFilterUserFeedbacksDataGridByStatus={ handleFilterUserFeedbacksDataGridBySelectedStatus }
            handleSearchFeedbacksByInputValue={ handleSearchFeedbacksByInputValue }
        />
    );
}