import {
    Button,
    Checkbox,
    Container,
    Stack,
    Typography,
    Card,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import ProductCard from './components/cards/product-card/product-card.tsx';
import OrderCard from './components/cards/order-card/order-card.tsx';
import './cart-page.scss';
import EmptyCartCard from './components/cards/empty-cart-card/empty-cart-card.tsx';
import { useStore } from '../../../stores';
import { observer } from 'mobx-react-lite';
import { useNavigate } from "react-router";
import { deleteProductFromUserBacket, getUserBacketInfo } from "../../../models/user/user-api.tsx";
import { ICartProduct } from "../../../interfaces/interfaces.ts";

const CartPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cartStore } = useStore();
    const {
        cart,
        totalBasketQuantity,
        isAllSelected,
        selectedProductIds,
    } = cartStore;

    const isBasketEmpty = cart.length === 0;
    const isSomeSelected = selectedProductIds.length > 0;

    useEffect(() => {
        getUserBacketInfo()
            .then(({ data: { backet } }: { data: { backet: ICartProduct[] } }) => {
                cartStore.setCart(backet);
            })
            .catch((error: unknown) => console.error(error));
    }, []);

    const handleSelectAllChange = () => {
        if (isAllSelected) {
            cartStore.setIsAllSelected(false);
            cartStore.setSelectedIds([]);
        } else {
            const allIds = cart.map((product) => product.id);
            cartStore.setIsAllSelected(true);
            cartStore.setSelectedIds(allIds);
        }
    };

    const handleProductSelect = (productId: number) => {
        const newSelectedIds = selectedProductIds.includes(productId)
            ? selectedProductIds.filter((id) => id !== productId)
            : [...selectedProductIds, productId];
        const newIsAllSelected = cart.length > 0 && newSelectedIds.length === cart.length;

        cartStore.setSelectedIds(newSelectedIds);
        cartStore.setIsAllSelected(newIsAllSelected);
    };

    const removeProducts = async (ids: number[]) => {
        const selectedIdsBeforeRemoval = selectedProductIds;

        deleteProductFromUserBacket(ids.join(','))
            .then(({ data: { backet } }: { data: { backet: ICartProduct[] } }) => {
                const actualCartIds = backet.map((product: ICartProduct) => product.id);
                const updatedCart = cart.filter((item) => actualCartIds.includes(item.id));
                cartStore.setCart(updatedCart);
                const updatedSelectedIds = selectedIdsBeforeRemoval.filter((id) => actualCartIds.includes(id));
                cartStore.setSelectedIds(updatedSelectedIds);
            })
            .catch((error: unknown) => console.error('Ошибка удаления товаров из корзины', error));
    };

    const handleProductRemove = (productId: number) => {
        removeProducts([productId]);
    };

    const handleRemoveProducts = () => {
        removeProducts(selectedProductIds);
    };

    const handleProductQuantityChange = async(productId: number, newQuantity: number) => {
        cartStore.setCartProductQuantity(productId, newQuantity);
    };

    const handleProceedToCheckout = () => {
        navigate('/cart/checkout');
    };

    return (
        <Container className="cart cart-page-container" maxWidth="lg">
            { isBasketEmpty ? (
                <EmptyCartCard />
            ) : (
                <Grid container rowSpacing={ 1 } columnSpacing={ 2 }>
                    <Grid size={ { sm: 12, md: 8, lg: 8, xl: 6 } } gap={ 2 } className="sticky-grid">
                        <Stack direction='row' spacing={ 2 } className="header-stack">
                            <Typography variant='h5' className="fw-bold">
                                { t('titles.cart') }
                            </Typography>
                            <Typography variant='subtitle1' className="color-secondary">
                                { t('text.cart.productsCount.product', { count: totalBasketQuantity }) }
                            </Typography>
                        </Stack>

                        <Card className="cart-page-card">
                            <Stack alignItems="center" flexDirection="row">
                                <Checkbox
                                    className="cart-page-checkbox"
                                    onChange={ handleSelectAllChange }
                                    checked={ cart.length === selectedProductIds.length }
                                />
                                <Typography
                                    className="cart-page-checkbox-text"
                                    component="div"
                                >
                                    { t('text.cart.selectAll') }
                                </Typography>
                            </Stack>
                            { isSomeSelected && (
                                <Button
                                    onClick={ handleRemoveProducts }
                                    size="small"
                                    aria-label="delete"
                                    className="delete-btn">
                                    { t('text.cart.deleteProductsButton') }
                                </Button>
                            ) }
                        </Card>

                        <Stack spacing={ 1 } className="basket-stack">
                            { cart.map((product: ICartProduct) => (
                                <ProductCard
                                    key={ product.id }
                                    isSelected={ selectedProductIds.includes(product.id) }
                                    onSelect={ () => handleProductSelect(product.id) }
                                    handleProductRemove={ () => handleProductRemove(product.id) }
                                    onQuantityChange={ (newQuantity: number) => handleProductQuantityChange(product.id, newQuantity) }
                                    product={ product }
                                />
                            )) }
                        </Stack>
                    </Grid>

                    <Grid size={ { sm: 12, md: 4, lg: 4, xl: 6 } } className="order-card-grid">
                        <OrderCard
                            isSomeSelected={ isSomeSelected }
                            handleProceedToCheckout={ handleProceedToCheckout }
                        />
                    </Grid>
                </Grid>
            ) }
        </Container>
    );
};

export default observer(CartPage);
