import { Checkbox, Container, IconButton, Stack, Typography } from '@mui/material';
import { DeleteForever } from '@material-ui/icons';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import ProductCard from './cards/productCard.tsx';
import OrderCard from './cards/orderCard.tsx';
import './cart.scss';

const productsCount = 10;
const Cart = () => {
    const { t} = useTranslation();
    const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

    return (
        <Container className="cart" maxWidth="xl">
            <Grid
                container
                rowSpacing={1}
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}
            >
                <Grid size={{ sm: 12, md: 8, lg: 8, xl: 6 }} gap={2}>
                    <Stack direction='row' spacing={2} sx={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                            {t('titles.cart')}
                        </Typography>
                        <Typography
                            sx={{ color: 'text.secondary' }}
                            variant='subtitle1'
                        >
                            {t('text.productsCount.product', { count: productsCount })}
                        </Typography>
                    </Stack>
                    <Checkbox
                        sx={{ alignSelf: 'flex-start' }}
                        onChange={() => setIsAllChecked(!isAllChecked)}
                    />
                    <span>Выбрать все</span>
                    { isAllChecked && <IconButton
                      color='primary'
                      size='small'
                      aria-label='delete'
                      sx={{ marginLeft: 5 }}
                    >
                      <DeleteForever fontSize='small' />
                        {productsCount}
                    </IconButton>}

                    <Stack spacing={1}>
                        { Array(productsCount).fill('').map(() => <ProductCard isAllChecked={isAllChecked} />) }
                    </Stack>
                </Grid >
                <Grid sx={{ alignSelf: 'flex-start', marginBottom: 3 }} size={{ md: 5, lg: 4, xl: 6 }}>
                    <OrderCard isAllChecked={isAllChecked} productsCount={productsCount} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cart;
