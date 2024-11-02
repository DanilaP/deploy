import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { IProduct } from '../../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom';

export default function MediaCard(props: { product: IProduct }) {

    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const showDetails = () => {
        navigate(`/shop/product/${ props.product.id }`);
    };

    return (
        <Card sx={ { maxWidth: 345 } }>
           <CardMedia style={ { display: "flex", justifyContent: "center" } } >
                <img className='product-image' src = { props.product.images[0] } />
           </CardMedia>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {  props.product.name }
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