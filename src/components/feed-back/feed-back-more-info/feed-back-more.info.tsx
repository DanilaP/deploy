import { useTranslation } from "react-i18next";
import { IFeedBack } from "../../../interfaces/interfaces";
import "./feed-back.more-info.scss";

interface IFeedbackMoreInfoProps {
    callback: IFeedBack | null
}

export default function FeedbackMoreInfo({
    callback
}: IFeedbackMoreInfoProps) {

    const { t } = useTranslation();

    return (
        <div className="call-back-more-info">
            <div className="name">
                <b>{ t("text.yourName") }</b>: { callback?.firstName } { callback?.secondName }
            </div>
            <div className="phone">
                <b>{ t("text.yourPhone") }</b>: { callback?.phoneNumber }
            </div>
            <div className="description">
                <b>{ t("text.description") }</b>: { callback?.description }
            </div>
            <div className="type-of-bid">
                <b>{ t("text.typeOfBid") }</b>: { callback?.typeOfBid }
            </div>
            <div className="type-of-bid">
                <b>{ t("text.dateOfCreation") }</b>: { callback?.createdAt }
            </div>
            <hr className="answer-border" />
            <div className="moderator-answer">
                <b>{ t("text.moderatorAnswer") }</b>: { callback?.moderatorAnswer ? callback.moderatorAnswer : t("text.no") }
            </div>
            <div className="date-of-answer">
                <b>{ t("text.dateOfAnswer") }</b>: { callback?.dateOfAnswer ? callback.dateOfAnswer : t("text.no") }
            </div>
            <div className="status">
                <b>{ t("text.status") }</b>: 
                { 
                    callback?.solved 
                        ? <span className="solved"> { t("text.solved") }</span> 
                        : <span className="waiting"> { t("text.waiting") }</span>
                }
            </div>
        </div>
    );
}