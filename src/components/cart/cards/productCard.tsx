import {
    Box,
    Card,
    CardMedia,
    Typography,
    Button,
    Checkbox,
    Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import {
    Add,
    Remove,
    FavoriteBorder,
  DeleteOutlined,
} from '@material-ui/icons';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    isSelected: boolean;
    onSelect: () => void;
    handleProductRemove: () => void;
    product: any;
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
const ProductCard: FC<ProductCardProps> = ({ product, isSelected, onSelect, handleProductRemove }) => {
    const { t } = useTranslation();
    const { productInfo, number } = product;
    const { variations, additionalInfo } = productInfo;

    const currentVariation = variations.find((variation: any) => variation.name === product.variation);
    const currentColor = additionalInfo.find((info: any) => info.name === 'Цвет')?.description || t('text.cart.noColor');
    const { stock, price, image, title } = currentVariation;

    const [open, setOpen] = useState<boolean>(false);

    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);

    const handleConfirmRemove = () => {
        handleProductRemove();
        handleCloseDialog();
    };

    return (
        <>
            <Card sx={styles.card}>
                <Stack direction="row" spacing={2} sx={styles.mainStack}>
                    <Stack direction="row" spacing={2}>
                        <Checkbox sx={styles.checkbox} checked={isSelected} onChange={onSelect} />
                        <CardMedia component="img" sx={styles.media} image={image} alt={productInfo.name} />
                        <Stack>
                            <Typography variant="h6" component="div" sx={styles.productName}>
                                {`${productInfo.name}, ${title} ${t('text.cart.variation')}`}
                            </Typography>
                            <Typography gutterBottom variant="subtitle2" sx={styles.colorDescription}>
                                {t('text.cart.color')} {currentColor}
                            </Typography>
                            <Box sx={styles.quantityBox}>
                                <Button variant="outlined" color="primary" size="small" sx={styles.quantityButton}>
                                    <Remove fontSize="small" />
                                </Button>
                                <Typography variant="body1">{number}</Typography>
                                <Button variant="outlined" color="primary" size="small" sx={styles.quantityButton}>
                                    <Add fontSize="small" />
                                </Button>
                            </Box>
                            <Typography gutterBottom variant="subtitle2" sx={styles.stockText}>
                                {t('text.cart.stock')}: {stock} {t('text.cart.pcs')}.
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack spacing={8}>
                        <Box sx={styles.actionIcons}>
                            <IconButton color="inherit" size="small" sx={styles.quantityButton}>
                                <FavoriteBorder fontSize="small" />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                size="small"
                                sx={styles.quantityButton}
                                onClick={handleOpenDialog}
                            >
                                <DeleteOutlined fontSize="small" />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" component="div" sx={styles.priceText}>
                            {price} {t('symbols.rub')}
                        </Typography>
                    </Stack>
                </Stack>
            </Card>

            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>
                    {t('text.cart.confirmDeleteTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('text.cart.confirmDeleteMessage')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmRemove} variant="contained" color="secondary" autoFocus>
                        {t('text.cart.delete')}
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary">
                        {t('text.cart.cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductCard;
