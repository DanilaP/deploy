import { useTranslation } from "react-i18next";
import { ICallBack } from "../../../interfaces/interfaces";
import "./call-back.more-info.scss";

interface ICallbackMoreInfoProps {
    callback: ICallBack | null
}

export default function CallbackMoreInfo({
    callback
}: ICallbackMoreInfoProps) {

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
                <b>{ t("text.dateOfCreation") }</b>: { callback?.dateOfCreation }
            </div>
            <hr className="answer-border" />
            <div className="moderator-answer">
                <b>{ t("text.moderatorAnswer") }</b>: { callback?.moderatorAnswer ? callback.moderatorAnswer : "Нет" }
            </div>
            <div className="date-of-answer">
                <b>{ t("text.dateOfAnswer") }</b>: { callback?.dateOfAnswer ? callback.dateOfAnswer : "Нет" }
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