import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './product-reviews-page.scss';
import { useNavigate, useParams } from 'react-router';
import $api from "../../../configs/axiosconfig/axios";
import { Button, Rating, TextField } from '@mui/material';
import Review from './review/review';
import { IReview } from '../../../interfaces/interfaces';
import { getAverageEvaluation } from '../../../helpers/product-page-helpers';
import InputFile from '../../../components-ui/custom-file-nput/file-input';
import { useStore } from '../../../stores';

export default function ProductReviews () {
    const params = useParams();
    const [productInfo, setProductInfo] = useState<{ title: string, reviews: IReview[] }>({ title: "", reviews: [] });
    const [userReviewInfo, setUserReviewInfo] = useState<{ text: string, evaluation: number | null }>(
        { text: "", evaluation: 0 }
    );

    const { userStore } = useStore();
    const { user } = userStore;

    const [userMediaFiles, setUserMediaFiles] = useState<{ image: File | null,video: File | null }>({
        image: null,
        video: null
    });
    const [userMediaFilesPreview, setUserMediaFilesPreview] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const createReview = () => {
        if (userReviewInfo.text !== "" && userReviewInfo.evaluation !== 0) {
            const review = { ...userReviewInfo, evaluation: userReviewInfo.evaluation };

            $api.put("/product", { review, productId: params.id, userMediaFiles })
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
                console.error(t("methods.createReview"), error);
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
            console.error(t("methods.deleteReview"), error);
        });
    };

    const changeUserMedia = (files: FileList | null) => {
        if (files) {
            const newMediaPreview = userMediaFilesPreview;
            if (files[0].type.includes("image")) {
                setUserMediaFiles({ ...userMediaFiles, image: files[0] });
                newMediaPreview[0] =  URL.createObjectURL(files[0]);
                setUserMediaFilesPreview(newMediaPreview);
            }
            else {
                setUserMediaFiles({ ...userMediaFiles, video: files[0] });
                newMediaPreview[1] =  URL.createObjectURL(files[0]);
                setUserMediaFilesPreview(newMediaPreview);
            }
            files[0].name.includes("image")
            ? setUserMediaFiles({ ...userMediaFiles, image: files[0] })
            : setUserMediaFiles({ ...userMediaFiles, video: files[0] });
        }
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
                { t("text.productReviews") }:
                <div className='product-link' onClick={ () => navigate(-1) }>{ productInfo?.title }</div>
            </div>
            <div className="reviews-content">
                <div className="reviews-settings">
                    <div className="reviews-settings-info">
                        <div className="average-rating">
                            { productInfo?.reviews?.length > 0 ? getAverageEvaluation(productInfo.reviews) : 0 }
                        </div>
                        <Rating
                            name="half-rating"
                            precision={ 0.5 }
                            readOnly
                            value = { productInfo ? getAverageEvaluation(productInfo.reviews) : 0 }
                        />
                    </div>
                    <div className="reviews-settings-content">
                        <div className="user-review">{ t("text.yourReview") } </div>
                        <TextField
                            value={ userReviewInfo.text }
                            onChange={ (e) => setUserReviewInfo({ ...userReviewInfo, text: e.target.value }) }
                            placeholder={ t("text.review") }
                            multiline
                            rows={ 2 }
                        />
                        <div className="files-data">
                            <div className='files-data-item'>
                                <div>{ t("text.uploadFiles") }</div>
                                <InputFile onChange={ (e) => changeUserMedia(e.target.files) } />
                            </div>
                            <div className="files-data-preview">
                            { userMediaFilesPreview.length > 0 
                            &&
                                <>
                                    <img className='files-data-image' src = { userMediaFilesPreview[0] } />
                                    <video className='files-data-image' src = { userMediaFilesPreview[1] } />
                                </>
                            }
                            </div>
                        </div>
                        <div className="user-evaluation">
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
