import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActions, Divider, Typography } from "@mui/material";
import { formatCurrency } from "../../../../../helpers/common-helpers.tsx";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import './payment-details-card.scss';
import { IOrder } from "../../../../../interfaces/interfaces.ts";
import $api from "../../../../../configs/axiosconfig/axios.js";
import { useNavigate } from "react-router";

interface PaymentDetailsCardProps {
    order: IOrder,
    productsData: any,
}

const PaymentDetailsCard:FC<PaymentDetailsCardProps> = ({ productsData, order }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleRepeatOrder = () => {
        $api.post("/backet", order.products)
            .then(() => navigate('/cart'))
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <Card className="payment-details-card">

            <CardContent className="payment-details-content">
                <Typography variant="body2">
                    { t('titles.goodsPage') }, { productsData.reduce((acc, { number } ) => acc + number, 0) } { t('text.pcs') }
                </Typography>
                <Typography variant="body2">
                    { formatCurrency(order.orderPrice) } { t('text.rub') }
                </Typography>
            </CardContent>

            <Divider />

            <CardContent className="payment-details-content">
                <Typography variant="subtitle2">{ t('text.delivery') }</Typography>
                <Typography variant="subtitle2" className="delivery-price">{ t('text.checkout.free') }</Typography>
            </CardContent>

            <Divider />

            <CardContent className="payment-details-content">
                <Typography variant="subtitle2">{ t('text.paid') }</Typography>
                <Typography variant="subtitle2">{ formatCurrency(order.orderPrice) } { t('text.rub') }</Typography>
            </CardContent>

            <CardContent className="payment-details-content payment-method">
                <Typography variant="caption">
                    { t(`text.checkout.orderPaymentMethods.${ order.paymentMethod }`) }
                </Typography>
            </CardContent>

            <CardActions className="payment-details-actions">
                <Button
                    onClick={ handleRepeatOrder }
                    size="small"
                    variant="contained"
                    fullWidth
                >
                    { t('text.repeatOrder') }
                </Button>
            </CardActions>
        </Card>
    );
};

export default PaymentDetailsCard;
