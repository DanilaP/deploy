import { FC } from "react";
import { CardMedia, Chip, Typography, Card, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IOrder, IProduct, IVariation } from "../../../../interfaces/interfaces.ts";
import { useNavigate } from "react-router";
import { formatCurrency, formatDate, getStatusColor } from "../../../../helpers/common-helpers.tsx";
import "./preview-card.scss";

interface PreviewCardProps {
    order: IOrder,
    products: any,
}
const PreviewCard: FC<PreviewCardProps> = ({ order, products }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const imagesCountForPreview = 4;

    const productImagesData = order.products.flatMap((orderProduct) => {
        const product = products
            .find((p: IProduct) => p.id === orderProduct.id);
        const variation = product
            .variations?.find((v: IVariation) => v.name === orderProduct.variation);
        return variation?.images
            .map((img) => ({ name: product.name, img, productId: product.id })) || []
            .slice(0, imagesCountForPreview);
    });

    return (
        <Card className="preview-card">
            <CardContent
                className="preview-card-header"
                onClick={ () => navigate(`/orders/order/${ order.orderNumber }`) }
            >
                    <Typography className="order-number">
                        { t('breadcrumbs.order') } №{ order.orderNumber } от { formatDate(order.createdAt) }
                    </Typography>
                    <Typography>
                        { t ('text.orderPrice') }: <span className="order-price">{ formatCurrency(order.orderPrice) } { t('text.rub') }</span>
                    </Typography>
            </CardContent>

            <CardContent className="delivery-details-wrapper">
                <div>
                    <div className="delivery-status">
                        <Typography>
                            { t(`text.checkout.orderDeliveryMethods.${ order.deliveryMethod }`) }
                        </Typography>
                        <Chip
                            label={ t(`text.vendorsLogistic.shippingStatuses.${ order.orderStatus }`) }
                            color={ getStatusColor(order.orderStatus) }
                        />
                    </div>
                    <Typography>
                        { order.orderStatus === 'in-transit'
                            ? `${ t('text.willBeDelivered') } ${ formatDate(order.estimatedDeliveryDate) }`
                            : order.orderStatus === 'delivered'
                                ? formatDate(order.deliveredAt)
                                : '' }
                    </Typography>
                </div>

                <div className="product-images-wrapper">
                    { productImagesData.map(({ img, productId, name }) => (
                        <CardMedia
                            onClick={ () => navigate(`/shop/product/${ productId }`) }
                            className="product-image"
                            key={ productId }
                            image={ img }
                            title={ name }
                        />
                    )) }
                </div>
            </CardContent>
        </Card>
    );
};

export default PreviewCard;
