import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Checkbox,
    Stack, IconButton,
} from '@mui/material';
import { Laptop, Add, Remove, FavoriteBorderSharp } from '@material-ui/icons';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    isAllChecked: boolean;
    item: any;
}
const productCard: FC<ProductCardProps> = ({ isAllChecked, item }) => {
    const { t } = useTranslation();

    return (
        <Card sx={{ maxWidth: '100%', boxShadow: 'none', backgroundColor: 'whitesmoke' }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Checkbox
                    sx={{ alignSelf: 'flex-start' }}
                    checked={isAllChecked}
                />
                <CardMedia style={ { display: "flex",  alignItems: 'flex-start' } } >
                    <Laptop color="primary" style={ { width: "100px", height: "100px" } } />
                </CardMedia>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="body1">
                        {item.name}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {item.description}
                    </Typography>
                </CardContent>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="body1">
                        {2000} {t('symbols.rub')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ minWidth: 0, padding: '3px 5px' }}
                        >
                            <Add fontSize="small" />
                        </Button>
                        <Typography variant="body1">1</Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ minWidth: 0, padding: '3px 5px' }}
                        >
                            <Remove fontSize="small" />
                        </Button>
                    </Box>
                </CardContent>
                <IconButton color="primary">
                    <FavoriteBorderSharp />
                </IconButton>
            </Stack>
        </Card>
    );
};

export default productCard;
