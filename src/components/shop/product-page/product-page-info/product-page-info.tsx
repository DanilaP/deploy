import { useEffect } from 'react';
import { useTranslation } from '../../../../translation/i18n';
import { Button, Rating } from '@mui/material';
import { Favorite, Textsms } from '@material-ui/icons';
import { IProduct } from '../../../../interfaces/interfaces';
import { getAverageEvaluation } from '../../../../helpers/product-page-helpers';
import { useNavigate } from 'react-router';

export default function ProductInfo (props: { 
    product: IProduct,
    variationInfo: any,
    changeVariation: (variationName: string) => void 
}) {

    const { t } = useTranslation();
    const navigation = useNavigate();

    useEffect(() => {
        document.title = t("titles.aboutPage");
    });

    return (
        <div className="product-info">
            <div className="product-info-header">
                { props.product?.description }
            </div>
            <div className="product-info-content">
                <div className="item">
                    { props.product?.category }
                </div>
                <div className="item price">
                    { props.variationInfo?.price } { t("text.rub") }
                </div>
                <div className="item">
                    { props.variationInfo?.stock } { t("text.pcs") }
                </div>
                <div className="item">
                    <Favorite className="favorite-icon" />
                </div>
            </div>
            <div className="additional-information">
                <Rating 
                    className="rating"
                    name="half-rating" 
                    precision={ 0.5 } 
                    readOnly 
                    value = { props.product ? getAverageEvaluation(props.product.reviews) : 0 } 
                />
                { ` (${ props.product?.reviews.length }) ` }
                <Textsms onClick = { () => navigation("reviews") } className='comment' />
            </div>
            <div className="variations">
            { t("text.variations") }: 
                {
                    props.product?.variations.map((variation: any) => {
                        return (
                            <div key={ variation.name } className="variation">
                                <div 
                                    onClick={ () => props.changeVariation(variation.name) } 
                                    className="variation-name"
                                >
                                        { variation.title }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <Button className='product-page-button' variant = "contained">{ t("text.toBacket") }</Button>
        </div>
    );
}