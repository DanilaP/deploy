import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Typography, CardActions } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

interface OrderCardProps {
    isAllChecked: boolean;
    productsCount: number;
}
const orderCard: FC<OrderCardProps> = ({ isAllChecked, productsCount }) => {
    const { t } = useTranslation();
    const sumToShow = isAllChecked ? (productsCount * 40_000).toLocaleString('ru-RU') : 0;

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                margin: '0 auto',
                boxShadow: 3,
            }}
        >
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {t('text.orderAmount')}
                </Typography>
                <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >
                    {t('text.products')}, {isAllChecked ? productsCount : 0 } {t('text.pcs')}.
                </Typography>
                <Typography
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                    variant="h6"
                    color="text.secondary"
                >
                    <span>
                        {t('text.total')}:
                    </span>
                    <span>
                        {sumToShow}{t('symbols.rub')}
                    </span>
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth>
                    {t('text.order')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default orderCard;
