import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';

const orderCard = () => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 2,
                maxWidth: 600,
                margin: '0 auto',
                boxShadow: 3,
            }}
        >
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Сумма заказа
                </Typography>
                <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >
                    Товары, 0 шт.
                </Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }} variant="h6" color="text.secondary">
                    <span>
                        ИТОГО:
                    </span>
                    <span>
                        0 {"\u20BD"}
                    </span>
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth>
                    Заказать
                </Button>
            </CardActions>
        </Card>
    )
};

export default orderCard;
