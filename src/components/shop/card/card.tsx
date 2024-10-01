import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { ShoppingBasket } from '@material-ui/icons';

export default function MediaCard() {
    const { t } = useTranslation();
    return (
        <Card sx={ { maxWidth: 345 } }>
           <CardMedia style={ { display: "flex", justifyContent: "center" } } >
                <ShoppingBasket color="primary" style={ { width: "200px", height: "100px" } } />
           </CardMedia>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Lizard
                </Typography>
                <Typography variant="body2" sx={ { color: 'text.secondary' } }>
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small">{ t("text.buy") }</Button>
                <Button variant="contained" size="small">{ t("text.details") }</Button>
            </CardActions>
        </Card>
    );
}