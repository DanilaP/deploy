import {
    Box,
    Card,
    CardMedia,
    Typography,
    Button,
    Checkbox,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, Tooltip,
} from '@mui/material';
import {
    FaPlus as Add,
    FaMinus as Remove,
    FaRegHeart as FavoriteBorder,
    FaTrashAlt as DeleteOutlined
} from 'react-icons/fa';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './product-card.scss';
import { BsInfoCircle } from "react-icons/bs";
import { useNavigate } from "react-router";

interface ProductCardProps {
    isSelected: boolean;
    onSelect: () => void;
    handleProductRemove: () => void;
    onQuantityChange: (quantity: number) => void;
    product: any;
}

const ProductCard: FC<ProductCardProps> = ({ product, isSelected, onSelect, handleProductRemove, onQuantityChange }) => {
    const { t } = useTranslation();
    const { productInfo, number, id } = product;
    const { variations, additionalInfo, images } = productInfo;

    const navigate = useNavigate();

    const currentVariation = variations.find((variation: any) => variation.name === product.variation);
    const currentColor = additionalInfo.find((info: any) => info.name === 'Цвет')?.description || t('text.cart.noColor');
    const { stock, price, title } = currentVariation;

    const [open, setOpen] = useState<boolean>(false);

    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);

    const handleConfirmRemove = () => {
        handleProductRemove();
        handleCloseDialog();
    };

    const handleIncrease = () => {
        onQuantityChange(product.number + 1);
    };

    const handleDecrease = () => {
        if (product.number > 1) {
            onQuantityChange(product.number - 1);
        }
    };

    const getAdditionalInfoTooltip = () => {
        return additionalInfo.map((info) => (
            <div  key={ info.id } style={ { marginBottom: '8px' } }>
                <strong>{ info.name }:</strong> { info.description }
            </div>
        ));
    };


    return (
        <>
            <Card className="card-product">
                <Stack direction="row" spacing={ 2 } className="mainStack">
                    <Stack direction="row" spacing={ 2 }>
                        <Checkbox className="product-checkbox" checked={ isSelected } onChange={ onSelect } />
                        <CardMedia component="img" className="product-media" image={ images[0] } alt={ productInfo.name } />
                        <Stack>
                            <Typography sx={ { alignSelf: 'flex-start' } } variant="h6" component="div" className="productName">
                                { `${productInfo.name}, ${ title } ${t('text.cart.variation')}` }
                            </Typography>
                            <Typography gutterBottom variant="subtitle2" className="colorDescription">
                                { t('text.cart.color') } { currentColor }
                            </Typography>
                            <Box className="quantityBox">
                                <Button
                                    disabled={ product.number === 1 }
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    className="quantityButton"
                                    onClick={ handleDecrease }
                                >
                                    <Remove fontSize="small" />
                                </Button>
                                <Typography variant="body1">{ number }</Typography>
                                <Button
                                    disabled={ product.number === stock }
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    className="quantityButton"
                                    onClick={ handleIncrease }
                                >
                                    <Add fontSize="small" />
                                </Button>
                            </Box>
                            <Typography gutterBottom variant="subtitle2" className="stockText">
                                { t('text.cart.stock') }: { stock } { t('text.cart.pcs') }.
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack spacing={ 8 }>
                        <Box className="actionIcons">
                            <Tooltip  title={ getAdditionalInfoTooltip() } arrow>
                                <IconButton
                                    onClick={ () => navigate(`/shop/product/${id}`) }
                                    className="outlined"
                                    color="inherit"
                                >
                                    <BsInfoCircle size={ 20 } />
                                </IconButton>
                            </Tooltip>
                            <IconButton color="inherit" size="small">
                                <FavoriteBorder fontSize="small" />
                            </IconButton>
                            <IconButton color="inherit" size="small" onClick={ handleOpenDialog }>
                                <DeleteOutlined fontSize="small" />
                            </IconButton>
                        </Box>

                        <Typography variant="h6" className="product-price">
                            { `${price} ${t('text.rub')}` }
                        </Typography>
                    </Stack>
                </Stack>

            </Card>

            <Dialog open={ open } onClose={ handleCloseDialog }>
                <DialogTitle>
                    { t('text.cart.confirmDeleteTitle') }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        { t('text.cart.confirmDeleteMessage') }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleConfirmRemove } variant="contained" color="error" autoFocus>
                        { t('text.cart.delete') }
                    </Button>
                    <Button onClick={ handleCloseDialog } color="primary">
                        { t('text.cart.cancel') }
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProductCard;
