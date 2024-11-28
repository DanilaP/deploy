import { useTranslation } from "react-i18next";
import { IFeedBack } from "../../../interfaces/interfaces";
import "./feed-back.more-info.scss";

interface IFeedbackMoreInfoProps {
    feedback: IFeedBack | null
}

export default function FeedbackMoreInfo({
    feedback
}: IFeedbackMoreInfoProps) {

    const { t } = useTranslation();

    return (
        <div className="call-back-more-info">
            <div className="name">
                <b>{ t("text.yourName") }</b>: { feedback?.firstName } { feedback?.secondName }
            </div>
            <div className="phone">
                <b>{ t("text.yourPhone") }</b>: { feedback?.phoneNumber }
            </div>
            <div className="description">
                <b>{ t("text.description") }</b>: { feedback?.description }
            </div>
            <div className="type-of-bid">
                <b>{ t("text.typeOfBid") }</b>: { feedback?.typeOfBid }
            </div>
            <div className="type-of-bid">
                <b>{ t("text.dateOfCreation") }</b>: { feedback?.createdAt }
            </div>
            <hr className="answer-border" />
            <div className="moderator-answer">
                <b>{ t("text.moderatorAnswer") }</b>: { feedback?.moderatorAnswer ? feedback.moderatorAnswer : t("text.no") }
            </div>
            <div className="date-of-answer">
                <b>{ t("text.dateOfAnswer") }</b>: { feedback?.dateOfAnswer ? feedback.dateOfAnswer : t("text.no") }
            </div>
            <div className="status">
                <b>{ t("text.status") }</b>: 
                { 
                    feedback?.solved 
                        ? <span className="solved"> { t("text.solved") }</span> 
                        : <span className="waiting"> { t("text.waiting") }</span>
                }
            </div>
        </div>
    );
}