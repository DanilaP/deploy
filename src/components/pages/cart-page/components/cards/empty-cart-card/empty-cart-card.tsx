import { Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import './empty-cart-card.scss';

const EmptyCartCard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Card className="empty-card">
            <CardContent>
                <Typography gutterBottom variant="h5" className="empty-card-title" component="div">
                    { t('text.cart.emptyBasket') }
                </Typography>
                <Typography gutterBottom variant="body1" className="empty-card-body">
                    { t('text.cart.findProductsInfo') }
                </Typography>
                <Button
                    variant="contained"
                    onClick={ () => navigate("/shop") }
                    className="empty-card-button"
                >
                    { t('text.cart.toCatalog') }
                </Button>
            </CardContent>
        </Card>
    );
};

export default EmptyCartCard;
