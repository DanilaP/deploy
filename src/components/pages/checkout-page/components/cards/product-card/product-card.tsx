import { FC } from "react";
import { useTranslation } from "react-i18next";
import { observer } from 'mobx-react-lite';
import { useNavigate } from "react-router";
import { Box, Button, CardMedia, Typography, CardContent, Card } from "@mui/material";
import Grid from "@mui/material/Grid2";
import formatCurrency from "../../../../../../helpers/utils/format-сurrency.ts";
import ProductInfoTooltip from "../../../../../partials/product-info-tooltip/product-info-tooltip.tsx";
import './product-card.scss';
import { ICartProduct } from "../../../../../../interfaces/interfaces.ts";
import { IAdditionalInfo } from "../../../../../../models/products/products.ts";


const ProductCard: FC<{ product: ICartProduct }> = ({ product }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { productInfo, id, number } = product;
    const { variations, additionalInfo, name } = productInfo;

    const currentVariation = variations.find((variation) => variation.name === product.variation);
    const currentColor = additionalInfo.find((info: IAdditionalInfo) => info.name === 'Цвет')?.description || t('text.cart.noColor');

    if (!currentVariation) {
        throw new Error('Variation not found');
    }

    const { price, title, images } = currentVariation;

    const handleNavigate = () => {
        navigate(`/cart/checkout/product/${ id }`);
    };

    return (
        <Grid className="product-grid-wrapper" key={ product.id }>
            <Card className="card-wrapper">
                { images && images.length > 0 && (
                    <CardMedia
                        component="img"
                        className="card-img"
                        image={ images[0] }
                        alt={ title }
                    />
                ) }
                <CardContent className="card-content">
                    <Box display="flex" alignItems="center">
                        <Typography className="card-title" variant="body1" component="div">
                            { name }, { title } { t('text.cart.variation') }
                        </Typography>
                        <ProductInfoTooltip additionalInfo={ additionalInfo } />
                        <Button
                            className="more-info-btn"
                            size="small"
                            color="primary"
                            onClick={ handleNavigate }
                        >
                            { t('text.cart.more') }
                        </Button>
                    </Box>
                    <Typography className="product-color-text" color="text.secondary">
                        { t('text.cart.color') }: { currentColor }
                    </Typography>
                    <Typography component="div" className="card-price" variant="h6">
                        ({ number } { t('text.cart.pcs') }) { formatCurrency(price) } { t('text.rub') }
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default observer(ProductCard);
