import { Rating } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IReview } from '../../../../interfaces/interfaces';

export default function Review (props: { review: IReview }) {

    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.aboutPage");
    });

    return (
        <div className="review">
            <div className="review-avatar">
                <img className='avatar' src = { props.review.avatar }></img>
            </div>
            <div className="review-info">
                <div className="review-info-header">
                    <div className="review-user-id">
                        { t("text.user") }: { props.review.clientId }
                    </div>
                    <div className="review-evaluation">
                        <Rating precision={0.5} name="half-rating" readOnly value={ props.review.evaluation }/>
                    </div>
                </div>
                <div className="review-text">
                    { props.review.text }
                </div>
            </div>
        </div>
    );
}