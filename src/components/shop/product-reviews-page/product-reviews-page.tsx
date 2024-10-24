import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './product-reviews-page.scss';
import { useParams } from 'react-router';
import $api from "../../../configs/axiosconfig/axios";
import { Button, Rating, TextField } from '@mui/material';
import Review from './review/review';
import { IReview } from '../../../interfaces/interfaces';
import { useSelector } from 'react-redux';

export default function ProductReviews () {

    const params = useParams();
    const [productInfo, setProductInfo] = useState<{ title: string, reviews: IReview[] }>({ title: "", reviews: [] });
    const [userReviewInfo, setUserReviewInfo] = useState<{ text: string, evaluation: number | null }>(
        { text: "", evaluation: 0 }
    );
    const user = useSelector((store: any) => store.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const getAverageEvaluation = () => {
        const evaluationQuantity = productInfo?.reviews.length;
        let averageValue: number = 0;
        productInfo?.reviews.map((review: any) => {
            averageValue += review.evaluation;
        });
        return averageValue / evaluationQuantity;
    };
    
    const createReview = () => {
        if (userReviewInfo.text !== "" && userReviewInfo.evaluation !== 0) {
            const review = { ...userReviewInfo, evaluation: userReviewInfo.evaluation };

            $api.put("/product", { review, productId: params.id })
            .then((res) => {
                const isReviewExisted = productInfo.reviews.filter((review: IReview) => review.clientId === user.id);
                if (isReviewExisted.length === 0) {
                    setProductInfo({ ...productInfo, reviews: [... productInfo.reviews, res.data.review] });
                }
                else {
                    setProductInfo({ ...productInfo, reviews: productInfo.reviews.map((review: IReview) => {
                        if (review.clientId === user.id) {
                            return res.data.review;
                        } else return review;
                    }) });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    };

    const deleteReview = () => {
        $api.delete(`/reviews/product?productId=${ params.id }&userId=${ user.id }`)
        .then((res) => {
            const filteredProductInfo = {
                title: productInfo.title,
                reviews: productInfo.reviews.filter((review) => review.clientId !== user.id)
            };
            setProductInfo(filteredProductInfo);
            setUserReviewInfo({ text: "", evaluation: 0 });
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        document.title = t("titles.aboutPage");
    });

    useEffect(() => {
        $api.get(`/reviews/product/?id=${ params.id }`)
        .then((res) => {
            const isReviewExisted = res.data.product.reviews.filter((review: IReview) => review.clientId === user.id);
            if (isReviewExisted.length !== 0) {
                setUserReviewInfo({ text: isReviewExisted[0].text, evaluation: isReviewExisted[0].evaluation });
            }
            setIsLoading(true);
            setProductInfo(res.data.product);
        })
        .catch((error) => {
            console.error(error);
        });
        
    }, []);

    return (
        <div className='reviews-main'>
            <div className="reviews-header">
                { t("text.productReviews") }: { productInfo?.title }
            </div>
            <div className="reviews-content">
                <div className="reviews-settings">
                    <div className="reviews-settings-info">
                        { t("text.averageEvaluation") }: 
                        <Rating 
                            name="half-rating" 
                            precision={ 0.5 } 
                            readOnly 
                            value = { getAverageEvaluation() } 
                        />
                    </div>
                    <div className="reviews-settings-content">
                        <TextField
                            value={ userReviewInfo.text } 
                            onChange={ (e) => setUserReviewInfo({ ...userReviewInfo, text: e.target.value }) } 
                            placeholder='Отзыв'
                            multiline 
                            rows={ 2 }
                        />
                        <div className="user-evaluation">
                            { t("text.yourEvaluation") } :  
                            { isLoading &&
                                <Rating
                                    name="half-rating"
                                    value={ userReviewInfo.evaluation } 
                                    precision={ 0.5 }
                                    onChange={(event, newValue) => {
                                        setUserReviewInfo({ ...userReviewInfo, evaluation: newValue });
                                    }}
                                />
                            }
                        </div>
                        <Button onClick={ createReview } variant='contained'>
                            {
                                productInfo.reviews.filter((review: IReview) => review.clientId === user.id).length !== 0
                                ? t("text.changeReview") 
                                : t("text.sendReview")
                            }
                        </Button>
                        {
                            productInfo.reviews.filter((review: IReview) => review.clientId === user.id).length !== 0
                            ? <Button onClick={ deleteReview } variant='contained'>{ t("text.deleteReview") }</Button>
                            : null
                        }
                    </div>
                </div>
                <div className="reviews">
                    {
                        productInfo?.reviews.map((review: IReview) => {
                            return (
                                <Review key={ review.clientId } review = { review } />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}