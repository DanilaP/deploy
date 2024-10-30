import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Typography, CardActions, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

interface OrderCardProps {
    selectedProductIds: any[];
    totalSum: number;
    totalQuantity: number;
}

interface OrderPromptProps {
    sumToShow: string;
    totalQuantity: number;
}

const emptyOrderPromptStyles = {
    typography: {
        gutterBottom: true,
        sx: {
            fontSize: '0.77rem',
            color: 'text.secondary',
        },
    },
};

const orderPromptStyles = {
    text: {
        gutterBottom: true,
        sx: {
            fontSize: '0.65rem',
            color: 'text.secondary',
            mb: 1,
        },
    },
    total: {
        sx: {
            display: 'flex',
            justifyContent: 'space-between',
            color: 'text.secondary',
            fontSize: '0.90rem',
            mt: 1,
        },
        variant: "h6" as const,
    },
    products: {
        gutterBottom: true as const,
        variant: "subtitle1" as const,
        component: "div" as const,
        sx: {
            color: 'text.secondary',
            fontSize: '0.90rem',
            display: 'flex',
            justifyContent: 'space-between',
        },
    },
    price: {
        sx: {
            color: 'black',
        },
    },
};

const orderCardStyles = {
    card: {
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        margin: '0 auto',
        boxShadow: 'none',
    },
};

const EmptyOrderPrompt = () => {
    const { t } = useTranslation();
    return (
        <CardContent>
            <Typography {...emptyOrderPromptStyles.typography}>
                {t('text.cart.productChoose')}
            </Typography>
        </CardContent>
    );
};

const OrderPrompt: FC<OrderPromptProps> = ({ sumToShow, totalQuantity}) => {
    const { t } = useTranslation();

    return (
        <CardContent>
            <Typography {...orderPromptStyles.text}>
                {t('text.cart.preDeliverInfo')}
            </Typography>
            <Divider />
            <Typography {...orderPromptStyles.total}>
                <span>
                    {t('text.cart.total')}:
                </span>
            </Typography>
            <Typography {...orderPromptStyles.products}>
                {t('text.products')}, {totalQuantity} {t('text.cart.pcs')}.
                <Typography {...orderPromptStyles.price}>
                    {sumToShow}{t('symbols.rub')}
                </Typography>
            </Typography>
        </CardContent>
    );
};

const orderCard: FC<OrderCardProps> = ({ selectedProductIds, totalSum, totalQuantity }) => {
    const { t } = useTranslation();
    const sumToShow = totalSum.toLocaleString('ru-RU');
    const isSomeSelected = selectedProductIds.length > 0;

    return (
        <Card sx={orderCardStyles.card}>
            {isSomeSelected ? (
                <OrderPrompt
                    sumToShow={sumToShow}
                    totalQuantity={totalQuantity}
                />
            ) : (
                <EmptyOrderPrompt />
            )}
            <CardActions>
                <Button variant="contained" disabled={!isSomeSelected} fullWidth>
                    {t('text.cart.placeOrderButton')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default orderCard;
