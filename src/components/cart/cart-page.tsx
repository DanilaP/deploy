import { Button, Checkbox, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import ProductCard from './cards/product-card/product-card.tsx';
import OrderCard from './cards/order-card/order-card.tsx';
import './cart-page.scss';
import $api from '../../configs/axiosconfig/axios.js';
import Card from "@mui/material/Card";
import EmptyCartCard from "./cards/empty-cart-card/empty-cart-card.tsx";
import {useStore} from "../../stores";
import { observer } from 'mobx-react-lite';

const CartPage = () => {
    const { t } = useTranslation();

    const { cartStore } = useStore();
    const { cart,
        totalSum,
        totalBasketQuantity,
        isAllSelected,
        selectedTotalQuantity,
        selectedProductIds,
    } = cartStore;

    const isBasketEmpty = cart.length === 0;
    const isSomeSelected = selectedProductIds.length > 0;

    const calculateFullBasketQuantity = () => {
        const totalQuantity = cart.reduce((acc, product) => acc + product.number, 0);
        cartStore.setTotalBasketQuantity(totalQuantity);
    };

    const calculateTotals = () => {
        const filteredBasket = cart.filter((product) => selectedProductIds.includes(product.id));

        const quantity = filteredBasket.reduce((acc, product) => product.number + acc, 0);
        const sum = filteredBasket.reduce((acc, product) => {
            const currentVariation = product.productInfo.variations.find((v) => v.name === product.variation);
            return acc + (currentVariation?.price * product.number || 0);
        }, 0);

        cartStore.updateCartData(sum, quantity);
    };

    useEffect(() => {
        const fetchBasketData = async () => {
            try {
                const { data: { backet } } = await $api.get('/backet');
                console.log({backet})
                cartStore.setCart(backet);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBasketData();
    }, []);


    useEffect(() => {
        if (cart.length > 0) {
            const allProductIds = cart.map((product) => product.id);
            cartStore.setSelectedProductIds(allProductIds);
            cartStore.setIsAllSelected(true);
        }
    }, [cart]);

    useEffect(() => {
        calculateTotals();
        calculateFullBasketQuantity();
    }, [selectedProductIds, cart]);


    const handleSelectAllChange = () => {
        const newSelectedIds = isAllSelected ? [] : cart.map((product) => product.id);

        cartStore.setSelectedProductIds(newSelectedIds);
        cartStore.setIsAllSelected(!isAllSelected)
    };

    const handleProductSelect = (productId: string) => {
        cartStore.toggleProductSelection(productId);
    };

    const handleProductRemove = async (productId: string) => {
        try {
            const  { data: { backet } } = await $api.delete("/backet", {
                params: {
                    ids: [productId].join(','),
                }
            });
            const ids = backet.map((product) => product.id);
            const filteredBasket = cart.filter((item) => ids.includes(item.id));
            cartStore.setCart(filteredBasket);
        } catch(error) {
            console.error(error);
        }
    };

    const handleRemoveProducts = async() => {
        try {
            const  { data: { backet } } = await $api.delete("/backet", {
                params: {
                    ids: [selectedProductIds].join(','),
                }
            });
            const ids = backet.map((product) => product.id);
            const filteredBasket = cart.filter((item) => ids.includes(item.id));
            cartStore.setCart(filteredBasket);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <Container className="cart cart-page-container" maxWidth="xl">
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
                            {cart.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    isSelected={selectedProductIds.includes(product.id)}
                                    onSelect={() => handleProductSelect(product.id)}
                                    handleProductRemove={() => handleProductRemove(product.id)}
                                    product={product}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ sm: 12, md: 4, lg: 4, xl: 6 }} className="order-card-grid">
                        <OrderCard />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default observer(CartPage);
