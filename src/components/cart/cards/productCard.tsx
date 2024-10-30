import {
    Box,
    Card,
    CardMedia,
    Typography,
    Button,
    Checkbox,
    Stack, IconButton,
} from '@mui/material';
import {
    Add,
    Remove,
    FavoriteBorder,
  DeleteOutlined,
} from '@material-ui/icons';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    isSelected: boolean;
    onSelect: () => void;
    product: any;
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
}

const styles = {
    card: { padding: 2, boxShadow: 'none' },
    mainStack: { alignItems: "center", justifyContent: 'space-between' },
    rowStack: { direction: 'row', spacing: 2 },
    checkbox: { alignSelf: 'flex-start' },
    media: { width: 150, height: 150 },
    productName: { fontSize: '0.875rem' },
    colorDescription: { color: 'text.secondary', fontSize: '0.65rem' },
    quantityBox: { display: 'flex', alignItems: 'center', gap: 1, mt: 2 },
    quantityButton: { minWidth: 0, padding: '3px 5px' },
    stockText: { color: 'text.primary', fontSize: '0.65rem', mt: 2 },
    actionIcons: { alignSelf: 'flex-start', display: 'flex', alignItems: 'center', mt: 2, color: 'gray' },
    priceText: { alignSelf: 'flex-start' }
};
const productCard: FC<ProductCardProps> = ({  product, isSelected, onSelect, quantity, onQuantityChange}) => {
    const { t } = useTranslation();
    const { productInfo } = product;

    const handleIncrease = () => {
        onQuantityChange(quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    return (
        <Card sx={styles.card}>
            <Stack direction="row" spacing={2} sx={styles.mainStack}>
                <Stack direction="row" spacing={2}>
                    <Checkbox sx={styles.checkbox} checked={isSelected} onChange={onSelect}/>
                    <CardMedia
                        component="img"
                        sx={styles.media}
                        image="https://opis-cdn.tinkoffjournal.ru/mercury/laptops-for-work-9.lbefgwwf4wck..jpg"
                        alt={productInfo.name}
                    />
                    <Stack>
                        <Typography variant="h6" component="div" sx={styles.productName}>
                            {`${productInfo.name}, базовая комплектация`}
                        </Typography>
                        <Typography gutterBottom variant="subtitle2" sx={styles.colorDescription}>
                            {t('text.cart.color')} {productInfo.additionalInfo.find(info => info.name === 'Цвет')?.description || t('text.cart.noColor')}
                        </Typography>
                        <Box sx={styles.quantityBox}>
                            <Button
                                disabled={!quantity}
                                onClick={handleDecrease}
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={styles.quantityButton}
                            >
                                <Remove fontSize="small" />
                            </Button>
                            <Typography variant="body1">{quantity}</Typography>
                            <Button
                                disabled={quantity >= productInfo.variations.find(variation => variation.name === product.variation)?.stock}
                                onClick={handleIncrease}
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={styles.quantityButton}
                            >
                                <Add fontSize="small" />
                            </Button>
                        </Box>
                        <Typography gutterBottom variant="subtitle2" sx={styles.stockText}>
                            {t('text.cart.stock')}: {productInfo.variations.find(variation => variation.name === product.variation)?.stock || 0} шт.
                        </Typography>
                    </Stack>
                </Stack>

                <Stack spacing={8}>
                    <Box sx={styles.actionIcons}>
                        <IconButton color="inherit" size="small" sx={styles.quantityButton}>
                            <FavoriteBorder fontSize="small" />
                        </IconButton>
                        <IconButton color="inherit" size="small" sx={styles.quantityButton}>
                            <DeleteOutlined fontSize="small" />
                        </IconButton>
                    </Box>
                    <Typography variant="h6" component="div" sx={styles.priceText}>
                        {productInfo.variations.find(variation => variation.name === product.variation)?.price} ₽
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    );
};

export default productCard;
