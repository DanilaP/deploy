import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import {
    Box,
    Button,
    CardMedia,
    Typography,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { observer } from 'mobx-react-lite';
import { FC } from "react";
import { useTranslation } from "react-i18next";
import './product-card.scss';
import { useNavigate } from "react-router";
import ProductInfoTooltip from "../../../components-ui/product-info-tooltip/product-info-tooltip.tsx";
import { formatCurrency } from "../../../../helpers/cart-helpers.tsx";
import { IProduct } from "../../../../models/products/products.ts";

const ProductCard: FC<{ product: IProduct }> = ({ product }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { productInfo, id, number } = product;
    const { variations, additionalInfo, name } = productInfo;

    const currentVariation = variations.find((variation) => variation.name === product.variation);
    const currentColor = additionalInfo.find((info: any) => info.name === 'Цвет')?.description || t('text.cart.noColor');
    const { price, title, images } = currentVariation;

    const formattedProductPrice = formatCurrency(price);

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
                        ({ number } { t('text.cart.pcs') }) { formattedProductPrice } { t('text.rub') }
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default observer(ProductCard);
