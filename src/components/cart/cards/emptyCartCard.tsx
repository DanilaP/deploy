import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const styles = {
    card: {
        textAlign: 'center',
        padding: 2,
        boxShadow: 'none',
    },
    title: {
        variant: "h5" as const,
        component: "div" as const,
        gutterBottom: true,
    },
    body: {
        variant: "body1" as const,
        color: "text.secondary",
        gutterBottom: true,
    },
    button: {
        variant: "contained" as const,
        color: "primary" as const,
        sx: { marginTop: 2 },
    },
};

const emptyCartCard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Card sx={styles.card}>
            <CardContent>
                <Typography {...styles.title}>
                    {t('text.cart.emptyBasket')}
                </Typography>
                <Typography {...styles.body}>
                    {t('text.cart.findProductsInfo')}
                </Typography>
                <Button
                    onClick={() => navigate("/shop")}
                    {...styles.button}
                >
                    {t('text.cart.toCatalog')}
                </Button>
            </CardContent>
        </Card>
    );
};

export default emptyCartCard;
