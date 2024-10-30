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
    const [selectedProductIds, setSelectedProductIds] = useState<any>([]);
    const [basket, setBasket] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(true);
    const [totalSum, setTotalSum] = useState(0);
    const productsCount = basket.length;

    const calculateTotalSum = () => {
        const sum = basket && basket
            .filter((product: any) => selectedProductIds.includes(product.id))
            .reduce((acc: number, product: any) => {
                const { variation, productInfo } = product;
                const fullVariation = productInfo.variations.find(v => v.name === variation);
                return acc + (fullVariation?.price || 0);
            }, 0);
        setTotalSum(sum);
    };

    useEffect(() => {
        calculateTotalSum();
    }, [selectedProductIds, basket]);

    const handleSelectAllChange = () => {
        if (isAllSelected) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(basket.map((product: any) => product.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleProductSelect = (productId: any) => {
        setSelectedProductIds((prevSelected: any) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id: any) => id !== productId)
                : [...prevSelected, productId]
        );
    };

    useEffect(() => {
        if (basket.length > 0) {
            const allProductIds = basket.map((product: any) => product.id);
            setSelectedProductIds(allProductIds);
            setIsAllSelected(true);
        }
    }, [basket]);

    useEffect(() => {
        setIsAllSelected(selectedProductIds.length === basket.length);
    }, [selectedProductIds, basket]);

    useEffect(() => {
        const getBacketData = async () => {
            try {
                const { data: { backet } } = await $api.get('/backet');
                setBasket(backet);
                console.log({ backet })
            } catch (error) {
                console.error(error);
            }
        };
        getBacketData();
    }, []);

    return (
        <Container className="cart" maxWidth="xl" sx={styles.container}>
            {basket.length === 0 && <EmptyCartCard />}
            {basket.length > 0 && (
                <Grid container rowSpacing={1} columnSpacing={2}>
                    <Grid size={{ sm: 12, md: 8, lg: 8, xl: 6 }} gap={2}>
                        <Stack direction='row' spacing={2} sx={styles.headerStack}>
                            <Typography variant='h5' sx={styles.boldTypographyStyle}>
                                {t('titles.cart')}
                            </Typography>
                            <Typography sx={styles.subtitleTypography} variant='subtitle1'>
                                {t('text.productsCount.product', { count: productsCount })}
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
                            {isAllSelected && (
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
                                    product={product}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    <Grid size={{ sm: 12, md: 4, lg: 4, xl: 6 }} sx={styles.orderCardGrid}>
                        <OrderCard
                            isAllSelected={isAllSelected}
                            productsCount={productsCount}
                            selectedProductIds={selectedProductIds}
                            totalSum={totalSum}
                        />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Cart;
