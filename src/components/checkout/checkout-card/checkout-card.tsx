import Card from "@mui/material/Card";
import {Button, CardActions, Divider, Stack, Typography} from "@mui/material";
import "./checkout-card.scss";
import CardContent from "@mui/material/CardContent";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../stores";
import { FaShoppingCart, FaTruck } from 'react-icons/fa';

interface CheckoutCard {
    selectedPayment: string;
    selectedDelivery: string;
    handleConfirmCheckout: () => void;
}

const CheckoutCard: React.FC<CheckoutCard>  = ({ selectedPayment, selectedDelivery, handleConfirmCheckout }) => {
    const { t } = useTranslation();

    const { cartStore } = useStore();
    const { totalSum, selectedTotalQuantity } = cartStore;

    const sumToShow = totalSum.toLocaleString('ru-RU');

    return (
        <Card className="checkout-card">
            <CardContent className="checkout-content">
                <Typography gutterBottom className="checkout-text">
                    {t('text.cart.orderData')}
                </Typography>
                <Divider />

                <Typography sx={{ mt: 3 }} variant="h6" className="checkout-total">
                <span>
                    {t('text.cart.total')}:
                </span>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div" className="checkout-products">
                    {t('text.products')} {selectedTotalQuantity} {t('text.cart.pcs')}.
                    <Typography className="price">
                        {`${sumToShow} ${t('text.rub')}`}
                    </Typography>
                </Typography>

                <Divider />

                <Typography sx={{ mt: 3 }} variant="h6" className="checkout-total">
                <span>
                   {t('text.checkout.paymentVar')}:
                </span>
                </Typography>

                <Stack sx={{ mt: 1, mb: 1}} direction="row" spacing={2}>
                    <Typography gutterBottom className="checkout-total">
                        {selectedPayment ? t(`text.checkout.orderPaymentMethods.${selectedPayment}`) : t('text.checkout.emptyPaymentVar')}
                    </Typography>
                </Stack>

                <Divider />

                <Typography sx={{ mt: 3 }} variant="h6" className="checkout-total">
                <span>
                   {t('text.checkout.deliveryVar')}:
                </span>
                </Typography>

                <Stack sx={{ mt: 1}} direction="row" spacing={1}>
                    <Typography gutterBottom className="checkout-total">
                        {selectedDelivery ? t(`text.checkout.orderDeliveryMethods.${selectedDelivery}`) : t('text.checkout.emptyDeliveryVar')}
                    </Typography>
                    {selectedDelivery === 'courier' ? <FaTruck size={20}/> : <FaShoppingCart size={20}/>}
                </Stack>

            </CardContent>

            <CardActions>
                <Button
                    onClick={handleConfirmCheckout}
                    variant="contained"
                    fullWidth
                >
                    {t('text.checkout.placeOrder')}
                </Button>
            </CardActions>
        </Card>
    )
};

export default CheckoutCard;
