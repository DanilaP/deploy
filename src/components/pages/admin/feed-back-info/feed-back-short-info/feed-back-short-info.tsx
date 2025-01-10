import { useTranslation } from "react-i18next";
import { IFeedBack } from "../../../../../models/feedbacks/feedbacks";
import "./feed-back-short-info.scss";

interface IFeedbackShortInfoProps {
    feedback: IFeedBack,
    isSelected: boolean,
    handleSwapCurrentFeedback: (feedback: IFeedBack) => void
}

export default function FeedbackShortInfo({
    feedback,
    isSelected,
    handleSwapCurrentFeedback
}: IFeedbackShortInfoProps) {

    const { t } = useTranslation();
    
    return (
        <div 
            className={ `feed-back-short-info ${isSelected ? 'selected' : ""}` }
            onClick={ () => handleSwapCurrentFeedback(feedback) }
        >
            <div className="short-info-title">
                { feedback?.firstName } { feedback?.secondName } ({ t(`typesOfFeedbacks.${feedback?.typeOfBid || ""}`) })
            </div>
            <div className="short-info-description">
                { feedback.description }
            </div>
        </div>
    );
}