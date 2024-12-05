import { Rating } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineFavorite } from "react-icons/md";
import { IReview } from '../../../../../models/products/products';

export default function Review (props: { review: IReview }) {

    const { t } = useTranslation();
    const [isLike, setIsLike] = useState<boolean>();
    const [currentLikes, setCurrentLikes] = useState(props.review?.likes);

    const likeReview = () => {
        if (isLike) {
            setIsLike(false);
            setCurrentLikes([]);
        } else {
            setIsLike(true);
            setCurrentLikes(["test"]);
        }
    };

    return (
        <div className="review">
            <div className="review-content">
                <div className="review-avatar">
                    <img className='avatar' src = { props.review.avatar }></img>
                </div>
                <div className="review-info">
                    <div className="review-info-header">
                        <div className="review-user-id">
                            { t("text.user") }: { props.review.clientId }
                        </div>
                        <div className="review-evaluation">
                            <Rating precision={ 0.5 } name="half-rating" readOnly value={ props.review.evaluation }/>
                        </div>
                    </div>
                    <div className="review-text">
                        { props.review.text }
                    </div>
                </div>
            </div>
            <div onClick = { likeReview } className={ `like-icon ${ isLike ? "active" : "inactive" }` } >
                { currentLikes?.length }
                <MdOutlineFavorite className='icon' />
            </div>
            <div className="review-images">
                {
                    props.review.photo && (
                        <a target="__blank" href = { props.review.photo }>
                            <img className='media' src = { props.review.photo } />
                        </a>
                    )
                }
                {
                    props.review.video && (
                        <a target="__blank" href = { props.review.video }>
                            <video className='media' src = { props.review.video } />
                        </a>
                    )
                }
            </div>
        </div>
    );
}