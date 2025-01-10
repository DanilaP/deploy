import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '../../../../models/products/products';
import "./card.scss";

export default function MediaCard(props: { 
    product: IProduct, 
    bestDiscount: number 
}) {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const actualPrice = Math.floor(props.product.price - (props.product.price * props.bestDiscount / 100));

    const showDetails = () => {
        navigate(`/shop/product/${ props.product.id }`);
    };

    return (
        <Card className='product-card'>
           <CardMedia style={ { display: "flex", justifyContent: "center" } } >
                <img className='product-image' src = { props.product.images[0] } />
           </CardMedia>
            <CardContent>
                <Typography className='product-title-wrapper' gutterBottom variant="h5" component="div">
                    {  props.product.name }
                    {
                        props.bestDiscount !== 0
                            ? 
                            <div className='discount-price'>
                                <span className='previous-price'>
                                    { props.product.price }р
                                </span>
                                <span className='default-price'>
                                    { actualPrice }р
                                </span>
                            </div>
                            : 
                            <span className='default-price'>
                                {
                                    props.product.price + "р"
                                }
                            </span>
                    }
                </Typography>
                <Typography gutterBottom component="div">
                    {  props.product.description }
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={ showDetails } variant="contained" size="small">{ t("text.details") }</Button>
            </CardActions>
        </Card>
    );
}