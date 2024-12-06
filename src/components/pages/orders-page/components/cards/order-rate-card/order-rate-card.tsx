import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardMedia, Typography } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import './order-rate-card.scss';
import IOrder from "../../../../../../models/order/order.ts";
import formatDate from "../../../../../../helpers/utils/format-date.ts";
import formatCurrency from "../../../../../../helpers/utils/format-сurrency.ts";

const OrderRateCard:FC<{ order: IOrder, productsData: any }> = ( { order, productsData }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Card className="order-rate-card">
            <CardContent className="order-details">
                <div>
                    <Typography variant="body2">
                        { `${ t('breadcrumbs.order') } №${ order.orderNumber } ${ t('text.from') } 
                          ${ formatDate(order.createdAt) } • 
                          ${ formatCurrency(order.orderPrice) } ${ t('text.rub') }` }
                    </Typography>
                    <Typography variant="caption">
                        { t(`text.checkout.orderDeliveryMethods.${order.deliveryMethod}`) }: { order.orderStatus === 'delivered' ? formatDate(order.deliveredAt) : '' }
                    </Typography>
                </div>
                <div className="product-images">
                    { productsData.map(({ img, id, name }) => (
                        <CardMedia
                            component="img"
                            className="product-image"
                            onClick={ () => navigate(`/shop/product/${ id }`) }
                            key={ id }
                            image={ img }
                            title={ name }
                        />
                    )) }
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderRateCard;
