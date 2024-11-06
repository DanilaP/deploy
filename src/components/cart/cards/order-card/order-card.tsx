import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Typography, CardActions, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import './order-card.scss';
import { useStore } from '../../../../stores';
import { observer } from 'mobx-react-lite';
import {useNavigate} from "react-router";

interface OrderPromptProps {
    sumToShow: string;
    totalQuantity: number;
}

const EmptyOrderPrompt = () => {
    const { t } = useTranslation();
    return (
        <CardContent className="empty-prompt-card-content">
            <Typography gutterBottom className="empty-prompt-text">
                {t('text.cart.productChoose')}
            </Typography>
        </CardContent>
    );
};

const OrderPrompt: FC<OrderPromptProps> = ({ sumToShow, totalQuantity}) => {
    const { t } = useTranslation();

    return (
        <CardContent className="order-prompt-card-content">
            <Typography gutterBottom className="order-text">
                {t('text.cart.preDeliverInfo')}
            </Typography>
            <Divider />
            <Typography variant="h6" className="total">
                <span>
                    {t('text.cart.total')}:
                </span>
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div" className="products">
                {t('text.products')}, {totalQuantity} {t('text.cart.pcs')}.
                <Typography className="price">
                    {`${sumToShow} ${t('text.rub')}`}
                </Typography>
            </Typography>
        </CardContent>
    );
};

const orderCard: FC<{ isSomeSelected: boolean, handleProceedToCheckout: () => void }> = ({ isSomeSelected, handleProceedToCheckout }) => {
    const { cartStore } = useStore();
    const {
        totalSum,
        selectedTotalQuantity,
    } = cartStore;

    const { t } = useTranslation();
    const sumToShow = totalSum.toLocaleString('ru-RU');

    return (
        <Card className="order-card">
            {isSomeSelected ? (
                <OrderPrompt
                    sumToShow={sumToShow}
                    totalQuantity={selectedTotalQuantity}
                />
            ) : (
                <EmptyOrderPrompt />
            )}
            <CardActions>
                <Button
                    onClick={handleProceedToCheckout}
                    variant="contained"
                    disabled={!isSomeSelected}
                    fullWidth
                >
                    {t('text.cart.placeOrderButton')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default observer(orderCard);
