import { FC } from "react";
import { CardMedia, Chip, Typography, Card, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { IProduct, IVariation } from "../../../../interfaces/interfaces.ts";
import { useNavigate } from "react-router";
import { formatDate, getStatusColor } from "../../../../helpers/common-helpers.tsx";
import "./preview-card.scss";
const PreviewCard: FC<any> = ({ order, products }) => {
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
                onClick={ () => navigate(`/orders/order/${order.orderNumber}`) }
            >
                    <Typography className="order-number">
                        { t('breadcrumbs.order') } №{ order.orderNumber } от { formatDate(order.createdAt) }
                    </Typography>
                    <Typography>
                        { t ('text.orderPrice') }: <span className="order-price">{ order.orderPrice } { t('text.rub') }</span>
                    </Typography>
            </CardContent>

            <CardContent className="delivery-status-wrapper">
                <div>
                    <div className="delivery-status">
                        <Typography>
                            { t(`text.checkout.orderDeliveryMethods.${order.deliveryMethod}`) }
                        </Typography>
                        <Chip
                            label={ t(`text.vendorsLogistic.shippingStatuses.${order.orderStatus}`) }
                            color={ getStatusColor(order.orderStatus) }
                        />
                    </div>
                    <Typography>
                        { order.orderStatus === "delivered" ? `${ t('text.deliveryDate') }: ${formatDate(order.deliveredAt) }` : "" }
                    </Typography>
                </div>

                <div className="product-images-wrapper">
                    { productImagesData.map(({ img, productId, name }) => (
                        <CardMedia
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
