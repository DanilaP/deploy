import { Button, Checkbox, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import ProductCard from './cards/product-card/product-card.tsx';
import OrderCard from './cards/order-card/order-card.tsx';
import './cart-page.scss';
import $api from '../../configs/axiosconfig/axios.js';
import Card from '@mui/material/Card';
import EmptyCartCard from './cards/empty-cart-card/empty-cart-card.tsx';
import { useStore } from '../../stores';
import { observer } from 'mobx-react-lite';
import {IProduct} from "../../interfaces/interfaces.ts";

const CartPage = () => {
    const { t } = useTranslation();
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
        if (cart.length > 0) {
            const allProductIds = cart.map((product) => product.id);
            cartStore.setSelectedProductIds(allProductIds);
            cartStore.setTotalBasketQuantity(cart.length);
        }
    }, [cart]);

    const handleSelectAllChange = () => {
        const newSelectedIds = isAllSelected ? [] : cart.map((product) => product.id);
        cartStore.setSelectedProductIds(newSelectedIds);
        cartStore.setIsAllSelected(!isAllSelected)
    };

    const handleProductSelect = (productId: number) => {
        cartStore.toggleProductSelection(productId);
    };

    const removeProducts = async (ids: number[]) => {
        try {
            const { data: { backet } } = await $api.delete("/backet", {
                params: {
                    ids: ids.join(','),
                }
            });
            const filteredIds = backet.map((product: IProduct) => product.id);
            const filteredBasket = cart.filter((item) => filteredIds.includes(item.id));
            cartStore.setCart(filteredBasket);
        } catch (error) {
            console.error(error);
        }
    };

    const handleProductRemove = (productId: number) => {
        removeProducts([productId]);
    };

    const handleRemoveProducts = () => {
        removeProducts(selectedProductIds);
    };

    const handleProductQuantityChange = async(productId: number, newQuantity: number) => {
        cartStore.updateProductQuantity(productId, newQuantity);
        const updatedCart = cartStore.cart;

        try {
            const { data } = await $api.put('/backet/updateCart', { cart: updatedCart });
            cartStore.setCart(data.cart.cart);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container className="cart cart-page-container" maxWidth="lg">
            { isBasketEmpty ? (
                <EmptyCartCard />
            ) : (
                <Grid container rowSpacing={1} columnSpacing={2}>
                    <Grid size={{ sm: 12, md: 8, lg: 8, xl: 6 }} gap={2}>
                        <Stack direction='row' spacing={2} className="header-stack">
                            <Typography variant='h5' className="fw-bold">
                                {t('titles.cart')}
                            </Typography>
                            <Typography variant='subtitle1' className="color-secondary">
                                {t('text.cart.productsCount.product', { count: totalBasketQuantity })}
                            </Typography>
                        </Stack>

                        <Card className="cart-page-card">
                            <Stack alignItems="center" flexDirection="row">
                                <Checkbox
                                    className="cart-page-checkbox"
                                    onChange={handleSelectAllChange}
                                    checked={isAllSelected}
                                />
                                <Typography
                                    className="cart-page-checkbox-text"
                                    component="div"
                                >
                                    {t('text.cart.selectAll')}
                                </Typography>
                            </Stack>
                            {isSomeSelected && (
                                <Button
                                    onClick={handleRemoveProducts}
                                    size="small"
                                    aria-label="delete"
                                    className="delete-btn">
                                    {t('text.cart.deleteProductsButton')}
                                </Button>
                            )}
                        </Card>

                        <Stack spacing={1} className="basket-stack">
                            {cart.map((product: IProduct) => (
                                <ProductCard
                                    key={product.id}
                                    isSelected={selectedProductIds.includes(product.id)}
                                    onSelect={() => handleProductSelect(product.id)}
                                    handleProductRemove={() => handleProductRemove(product.id)}
                                    onQuantityChange={(newQuantity: number) => handleProductQuantityChange(product.id, newQuantity)}
                                    product={product}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ sm: 12, md: 4, lg: 4, xl: 6 }} className="order-card-grid">
                        <OrderCard isSomeSelected={isSomeSelected} />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default observer(CartPage);
