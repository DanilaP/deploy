import { FC } from "react";
import { CardMedia, Chip, Typography, Card, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import "./preview-card.scss";
import { IProduct, IVariation } from "../../../../../../models/products/products.ts";
import IOrder from "../../../../../../models/order/order.ts";
import { getStatusColor } from "../../../../../../helpers/utils/get-status-color.ts";
import formatDate from "../../../../../../helpers/utils/format-date.ts";
import formatCurrency from "../../../../../../helpers/utils/format-сurrency.ts";

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
            .map((img: string) => ({ name: product.name, img, productId: product.id })) || []
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
