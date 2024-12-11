import { useTranslation } from "react-i18next";
import "./feed-back.more-info.scss";
import FeedbackAttachment from "../../../../partials/file-attachment/file-attachment";
import { IFeedBack } from "../../../../../models/feedbacks/feedbacks";

interface IFeedbackMoreInfoProps {
    feedback: IFeedBack | null,
    handleSearchNextFeedbacksForFeedback: (feedback: IFeedBack) => IFeedBack[],
    handleSearchPrevFeedbacksForFeedback: (feedback: IFeedBack) => IFeedBack[],
    handleSwapCurrentFeedback: (feedback: IFeedBack) => void,
}

export default function FeedbackMoreInfo({
    feedback,
    handleSearchNextFeedbacksForFeedback,
    handleSearchPrevFeedbacksForFeedback,
    handleSwapCurrentFeedback
}: IFeedbackMoreInfoProps) {

    const { t } = useTranslation();
    const prevFeedbacks = 
        feedback 
            ? [...handleSearchNextFeedbacksForFeedback(feedback)]
            : [];
    const nextFeedbacks = 
        feedback 
            ? [...handleSearchPrevFeedbacksForFeedback(feedback)]
            : [];       

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
                <b>{ t("text.typeOfBid") }</b>: { t(`typesOfFeedbacks.${feedback?.typeOfBid || ""}`) }
            </div>
            <div className="email">
                <b>{ t("text.email") }</b>: { feedback?.email }
            </div>
            <div className="date-of-creation">
                <b>{ t("text.dateOfCreation") }</b>: { feedback?.createdAt }
            </div>
            <div className="attachments">
                <b>{ t("text.attachments") }: </b>
                {
                    feedback?.attachments?.map(attachment => (
                        <FeedbackAttachment
                            key={ attachment.src }
                            attachment={ attachment }
                        />
                    ))
                }
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
            <hr />
            <div className="bid-history">
                <div className="bid-history-content-prev">
                    <span>Предыдущие заявки: </span>
                    {
                        prevFeedbacks.map(el => {
                            return (
                                <div 
                                    className="history-bid-wrapper"
                                    key={ el.id }
                                    onClick={ () => handleSwapCurrentFeedback(el) }
                                >Заявка { el.id }</div>
                            );
                        })
                    }
                </div>
                <div className="bid-history-content-next">
                    <span>Следующие заявки: </span>
                    {
                        nextFeedbacks.map(el => {
                            return (
                                <div 
                                    className="history-bid-wrapper"
                                    key={ el.id }
                                    onClick={ () => handleSwapCurrentFeedback(el) }
                                >Заявка { el.id }</div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}