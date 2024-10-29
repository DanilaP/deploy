import { Checkbox, Container, IconButton, Stack, Typography } from '@mui/material';
import { DeleteForever } from '@material-ui/icons';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import {useEffect, useState} from 'react';

import ProductCard from './cards/productCard.tsx';
import OrderCard from './cards/orderCard.tsx';
import './cart.scss';
import $api from '../../configs/axiosconfig/axios.js';

const Cart = () => {
    const { t} = useTranslation();
    const [isAllChecked, setIsAllChecked] = useState<boolean>(true);
    const [backet, setBacket] = useState([]);

    const productsCount = backet.length;

    useEffect(() => {
        const getBacketData = async() => {
            try {
                const { data: { backet } } = await  $api.get('/backet');
                setBacket(backet);
            } catch(error) {
                console.error(error);
            }
        };
        getBacketData();
    }, []);

    return (
        <Container className="cart" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid
                container
                size={10}
                rowSpacing={1}
                columnSpacing={5}
                sx={{ marginTop: 5 }}
            >
                <Grid size={{ sm: 12, md: 8, lg: 8, xl: 6 }} gap={2}>
                    <Stack direction='row' spacing={2} sx={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                            {t('titles.cart')}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }} variant='subtitle1'>
                            {t('text.productsCount.product', { count: productsCount })}
                        </Typography>
                    </Stack>
                    <Checkbox
                        sx={{ alignSelf: 'flex-start' }}
                        onChange={() => setIsAllChecked(!isAllChecked)}
                        checked={isAllChecked}
                    />
                    <span>Выбрать все</span>
                    {isAllChecked && (
                        <IconButton color='primary' size='small' aria-label='delete' sx={{ marginLeft: 5 }}>
                            <DeleteForever fontSize='small' />
                            {productsCount}
                        </IconButton>
                    )}
                    <Stack spacing={1}>
                        {backet.map((item) => (
                            <ProductCard isAllChecked={isAllChecked} item={item} />
                        ))}
                    </Stack>
                </Grid>

                <Grid size={{ sm: 12, md: 4, lg: 4, xl: 6 }}  sx={{ marginTop: 11, alignSelf: 'flex-start' }}>
                    <OrderCard isAllChecked={isAllChecked} productsCount={productsCount} />
                </Grid>
            </Grid>
        </Container>

    );
};

export default Cart;
