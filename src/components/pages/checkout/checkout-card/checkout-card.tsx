import Card from "@mui/material/Card";
import {
    Button,
    CardActions,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import "./checkout-card.scss";
import CardContent from "@mui/material/CardContent";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../stores/index.ts";
import { FC } from "react";
import formatCurrency from "../../../../helpers/utils/format-сurrency.ts";

interface CheckoutCard {
    selectedPayment: string;
    selectedDelivery: string;
    handleConfirmCheckout: () => boolean;
}

const CheckoutCard: FC<CheckoutCard>  = ({ selectedPayment, selectedDelivery, handleConfirmCheckout }) => {
    const { t } = useTranslation();

    const { cartStore } = useStore();
    const { totalSum, selectedTotalQuantity } = cartStore;

    const priceToShow = formatCurrency(totalSum);

    return (
        <Card className="checkout-card-wrapper">
            <CardContent className="checkout-content">

                <Typography gutterBottom variant="subtitle1" component="div" className="checkout-info">
                    { t('text.products') }, { selectedTotalQuantity } { t('text.cart.pcs') }.
                    <Typography className="price">
                        { `${priceToShow} ${t('symbols.rub')}` }
                    </Typography>
                </Typography>

                <Typography gutterBottom variant="subtitle1" component="div" className="checkout-info">
                    { selectedDelivery
                        ? t(`text.checkout.orderDeliveryMethods.${ selectedDelivery }`)
                        : t('text.checkout.emptyDeliveryVar') }
                    <Typography className="delivery-price">
                        { t('text.checkout.free') }
                    </Typography>
                </Typography>

                <Typography gutterBottom variant="subtitle1" component="div" className="checkout-info total-price">
                    { t('text.cart.total') }:
                    <Typography className="total-price">
                        { `${priceToShow} ${t('symbols.rub')}` }
                    </Typography>
                </Typography>

                <Divider />

                <Stack className="payment-stack" direction="row" spacing={ 2 }>
                    <Typography gutterBottom className="checkout-total">
                        { selectedPayment
                            ? t(`text.checkout.orderPaymentMethods.${ selectedPayment }`)
                            : t('text.checkout.emptyPaymentVar') }
                    </Typography>
                </Stack>

            </CardContent>

            <CardActions>
                <Button
                    onClick={ handleConfirmCheckout }
                    variant="contained"
                    fullWidth
                >
                    { t('text.checkout.placeOrder') }
                </Button>
            </CardActions>
        </Card>
    );
};

export default CheckoutCard;
