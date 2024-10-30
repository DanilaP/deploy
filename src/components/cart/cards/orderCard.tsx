import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button, Typography, CardActions, Divider} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

interface OrderCardProps {
    isAllChecked: boolean;
    productsCount: number;
    selectedProductIds: any[];
    totalSum: number;
}

interface OrderPromtProps {
    isAllChecked: boolean;
    productsCount: number;
    sumToShow: number | string;
    selectedProductIds: any[];
    totalSum: number;
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

const OrderPrompt: FC<OrderPromtProps> = ({ isAllChecked, productsCount, sumToShow}) => {
    const { t } = useTranslation();

    return (
        <CardContent>
            <Typography {...orderPromptStyles.text}>
                {t('text.cart.preDeliverInfo')}
            </Typography>
            <Divider />
            <Typography {...orderPromptStyles.total}>
                <span>
                    {t('text.total')}:
                </span>
            </Typography>
            <Typography {...orderPromptStyles.products}>
                {t('text.products')}, {isAllChecked ? productsCount : 0} {t('text.pcs')}.
                <Typography {...orderPromptStyles.price}>
                    {sumToShow}{t('symbols.rub')}
                </Typography>
            </Typography>
        </CardContent>
    );
};

const orderCard: FC<OrderCardProps> = ({ isAllChecked, productsCount, selectedProductIds, totalSum }) => {
    const { t } = useTranslation();
    const sumToShow = totalSum.toLocaleString('ru-RU');

    return (
        <Card sx={orderCardStyles.card}>
            {selectedProductIds.length > 0 ? (
                <OrderPrompt isAllChecked={isAllChecked} productsCount={productsCount} sumToShow={sumToShow} />
            ) : (
                <EmptyOrderPrompt />
            )}
            <CardActions>
                <Button variant="contained" disabled={selectedProductIds.length === 0} fullWidth>
                    {t('text.cart.placeOrderButton')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default orderCard;
