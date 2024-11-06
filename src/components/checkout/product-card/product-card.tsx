import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import {CardMedia, Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { observer } from 'mobx-react-lite';
import { FC } from "react";
import { useTranslation } from "react-i18next";
import './product-card.scss';

const ProductCard: FC<any> = ({ product }) => {
    const { t } = useTranslation();

    const { productInfo, number } = product;
    const { variations, additionalInfo, name } = productInfo;

    const currentVariation = variations.find((variation) => variation.name === product.variation);
    const currentColor = additionalInfo.find((info) => info.name === 'Цвет')?.description || t('text.cart.noColor');
    const { images } = currentVariation;
    const price = currentVariation.price;
    const title = currentVariation.title;


    return (
        <Grid className="product-grid-wrapper" key={product.id}>
            <Card className="card-wrapper">
                {images && images.length > 0 && (
                    <CardMedia
                        component="img"
                        className="card-img"
                        image={images[0]}
                        alt={title}
                    />
                )}
                <CardContent className="card-content">
                    <Typography variant="body1" component="div">
                        {name}, {title} {t('text.cart.variation')}
                    </Typography>
                    <Typography className="fs-16 mb-1" color="text.secondary">
                        {t('text.cart.color')}: {currentColor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {number} {t('text.pcs')}
                    </Typography>
                    <Typography className="card-price" variant="h6" color="text.primary">
                        {price} {t('text.rub')}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default observer(ProductCard);
