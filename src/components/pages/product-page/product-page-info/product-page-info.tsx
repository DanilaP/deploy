import { useState } from 'react';
import { useTranslation } from '../../../../translation/i18n';
import { Button, Rating, TextField } from '@mui/material';
import { MdOutlineFavorite, MdTextsms } from "react-icons/md";
import { getAverageEvaluation } from '../../../../helpers/product-page-helpers';
import { useNavigate } from 'react-router';
import './product-page-info.scss';
import $api from '../../../../configs/axiosconfig/axios';
import { IProduct } from '../../../../models/products/products';

export default function ProductInfo (props: {
    product: IProduct,
    variationInfo: any,
    changeVariation: (variationName: string) => void
}) {

    const { t } = useTranslation();
    const [choosenNumber, setChoosenNumber] = useState("");
    const navigation = useNavigate();

    const addToBacket = () => {
        if (choosenNumber !== "") {
            $api.post("/backet", [ {
                id: props.product.id,
                number: choosenNumber,
                variation: props.variationInfo.name
            } ])
            .catch((error) => {
                console.error(error);
            });
        }
    };

    return (
        <div className="product-info">
            <div className="product-info-header">
                { props.product?.description }
            </div>
            <div className="product-info-content">
                <div className="item price">
                    { props.variationInfo?.price } { t("text.rub") }
                </div>
                <div className="item">
                    <MdOutlineFavorite className="icon favorite-icon" />
                </div>
                <div className="additional-information">
                    <Rating
                        className="rating"
                        name="half-rating"
                        precision={ 0.5 }
                        readOnly
                        value = { props.product ? Number(getAverageEvaluation(props.product.reviews)) : 0 }
                    />
                    { ` (${ props.product?.reviews.length }) ` }
                    <MdTextsms onClick = { () => navigation("reviews") } className='icon comment' />
                    { t("text.review") }
                </div>
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
            <div className="settings">
                <TextField
                    onChange={ (e) => setChoosenNumber(e.target.value) }
                    inputProps = { { min: 0 } }
                    type='number'
                    placeholder={ t("text.quantity") }>
                </TextField>
                <Button
                    onClick={ addToBacket }
                    className='product-page-button'
                    variant = "contained"
                >
                    { t("text.toBacket") }
                </Button>
            </div>
        </div>
    );
}
