import { Button, Checkbox, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import ProductCard from './cards/productCard.tsx';
import OrderCard from './cards/orderCard.tsx';
import './cart.scss';
import $api from '../../configs/axiosconfig/axios.js';
import Card from "@mui/material/Card";
import EmptyCartCard from "./cards/emptyCartCard.tsx";

const styles = {
    container: {
        mt: 4,
        mb: 4,
    },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        pl: 2,
        pr: 4,
        boxShadow: 'none',
    },
    checkBox: {
        alignSelf: 'flex-start',
    },
    checkboxText: {
        fontSize: '15px',
    },
    headerStack: {
        display: 'flex',
        alignItems: 'baseline',
        mb: 2,
    },
    boldTypographyStyle: {
        fontWeight: 'bold',
    },
    subtitleTypography: {
        color: 'text.secondary',
    },
    button: {
        fontSize: '0.70rem',
        marginLeft: 5,
        color: 'grey.500',
        ':hover': {
            color: 'primary.main',
            backgroundColor: 'transparent',
        },
    },
    orderCardGrid: {
        marginTop: 7,
        alignSelf: 'flex-start',
    },
    basketStack: {
        mt: 3,
    },
};

const Cart = () => {
    const { t } = useTranslation();
    const [basket, setBasket] = useState<any>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<Array<number>>([]);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(true);
    const [totalSum, setTotalSum] = useState<number>(0);
    const [selectedTotalQuantity, setSelectedTotalQuantity] = useState<number>(0);
    const [totalBasketQuantity, setTotalBasketQuantity] = useState<number>(0);

    const isBasketEmpty = basket.length === 0;
    const isSomeSelected = selectedProductIds.length > 0;

    const calculateFullBasketQuantity = () => {
        const totalQuantity = basket.reduce((acc, product) => acc + product.number, 0);
        setTotalBasketQuantity(totalQuantity);
    };

    const calculateTotals = () => {
        const filteredBasket = basket.filter((product) => selectedProductIds.includes(product.id));

        const quantity = filteredBasket.reduce((acc, product) => product.number + acc, 0);
        const sum = filteredBasket.reduce((acc, product) => {
            const currentVariation = product.productInfo.variations.find((v) => v.name === product.variation);
            return acc + (currentVariation?.price * product.number || 0);
        }, 0);

        setSelectedTotalQuantity(quantity);
        setTotalSum(sum);
    };

    useEffect(() => {
        const fetchBasketData = async () => {
            try {
                const { data: { backet } } = await $api.get('/backet');
                setBasket(backet);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBasketData();
    }, []);

    useEffect(() => {
        if (basket.length > 0) {
            const allProductIds = basket.map((product) => product.id);
            setSelectedProductIds(allProductIds);
            setIsAllSelected(true);
        }
    }, [basket]);

    useEffect(() => {
        setIsAllSelected(selectedProductIds.length === basket.length);
        calculateTotals();
        calculateFullBasketQuantity();
    }, [selectedProductIds, basket]);

    const handleSelectAllChange = () => {
        const newSelectedIds = isAllSelected ? [] : basket.map((product) => product.id);
        setSelectedProductIds(newSelectedIds);
        setIsAllSelected(!isAllSelected);
    };

    const handleProductSelect = (productId: string) => {
        setSelectedProductIds(prevSelected => {
                return prevSelected.includes(productId)
                    ? prevSelected.filter(id => id !== productId)
                    : [...prevSelected, productId];
            }
        );
    };

    const handleProductRemove = async (productId: string) => {
        try {
            const  { data: { backet } } = await $api.delete("/backet", {
                params: {
                    id: productId,
                }
            });
            const ids = backet.map((product) => product.id);
            const filteredBasket = basket.filter((item) => ids.includes(item.id));
            setBasket(filteredBasket);
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <Container className="cart" maxWidth="xl" sx={styles.container}>
            { isBasketEmpty ? (
                <EmptyCartCard />
            ) : (
                <Grid container rowSpacing={1} columnSpacing={2}>
                    <Grid size={{ sm: 12, md: 8, lg: 8, xl: 6 }} gap={2}>
                        <Stack direction='row' spacing={2} sx={styles.headerStack}>
                            <Typography variant='h5' sx={styles.boldTypographyStyle}>
                                {t('titles.cart')}
                            </Typography>
                            <Typography sx={styles.subtitleTypography} variant='subtitle1'>
                                {t('text.cart.productsCount.product', { count: totalBasketQuantity })}
                            </Typography>
                        </Stack>

                        <Card sx={styles.card}>
                            <Stack alignItems="center" flexDirection="row">
                                <Checkbox
                                    sx={styles.checkBox}
                                    onChange={handleSelectAllChange}
                                    checked={isAllSelected}
                                />
                                <Typography component="div" sx={styles.checkboxText}>{t('text.cart.selectAll')}</Typography>
                            </Stack>
                            {isSomeSelected && (
                                <Button size="small" aria-label="delete" sx={styles.button}>
                                    {t('text.cart.deleteProductsButton')}
                                </Button>
                            )}
                        </Card>

                        <Stack spacing={1} sx={styles.basketStack}>
                            {basket.map((product: any) => (
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

                    <Grid size={{ sm: 12, md: 4, lg: 4, xl: 6 }} sx={styles.orderCardGrid}>
                        <OrderCard
                            selectedProductIds={selectedProductIds}
                            totalSum={totalSum}
                            totalQuantity={selectedTotalQuantity}
                        />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Cart;
