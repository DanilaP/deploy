import {
    Box,
    Card,
    CardMedia,
    Typography,
    Button,
    Checkbox,
    Stack,
    IconButton
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
import { useNavigate } from "react-router";
import ProductInfoTooltip from "../../../../../partials/product-info-tooltip/product-info-tooltip.tsx";
import './product-card.scss';
import CustomModal from '../../../../../components-ui/custom-modal/custom-modal.tsx';
import { IAdditionalInfo, IVariation } from "../../../../../../models/products/products.ts";
import { ICartProduct } from "../../../../../../interfaces/interfaces.ts";

interface ProductCardProps {
    isSelected: boolean;
    onSelect: () => void;
    handleProductRemove: () => void;
    onQuantityChange: (quantity: number) => void;
    product: ICartProduct;
}

const ProductCard: FC<ProductCardProps> = ({ product, isSelected, onSelect, handleProductRemove, onQuantityChange }) => {
    const { t } = useTranslation();
    const { productInfo, number  } = product;
    const { variations, additionalInfo, id } = productInfo;

    const navigate = useNavigate();

    const currentVariation = variations.find((variation: IVariation) => variation.name === product.variation);
    const currentColor = additionalInfo.find((info: IAdditionalInfo) => info.name === 'Цвет')?.description || t('text.cart.noColor');

    if (!currentVariation) {
        throw new Error('Variation not found');
    }
    const { stock, price, title, images } = currentVariation || {};
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

    return (
        <>
            <Card className="card-product">
                <Stack direction="row" spacing={ 2 } className="mainStack">
                    <Stack direction="row" spacing={ 2 }>
                        <Checkbox className="product-checkbox" checked={ isSelected } onChange={ onSelect } />
                        <CardMedia component="img" className="product-media" image={ images[0] } alt={ productInfo.name } />
                        <Stack>
                            <Typography variant="h6" component="div" className="productName">
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
                            <ProductInfoTooltip
                                additionalInfo={ additionalInfo }
                                onClickHandler={ () => navigate(`/shop/product/${ id }`) }
                            />
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

            <CustomModal
                isDisplay = { open }
                title = { t('text.cart.confirmDeleteTitle') }
                closeModal = { handleCloseDialog }
                actionConfirmed = { handleConfirmRemove }
                typeOfActions = 'default'
            >
                <div>{ t('text.cart.confirmDeleteMessage') }</div>
            </CustomModal>
        </>
    );
};

export default ProductCard;
