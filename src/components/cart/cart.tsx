import { Checkbox, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import ProductCard from "./productCard.tsx";
import OrderCard from "./orderCard.tsx";

const renderProductCards = (count: number) => Array(count).fill('').map(() => (
    <ProductCard />
));
const Cart = () => {
    return (
        <Grid
            container
            rowSpacing={1}
            sx={{ margin: 5, maxWidth: '100%' }}
        >
            <Grid size={{ md: 8, lg: 8, xl: 6 }}>
                <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: "baseline" }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Корзина
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }} variant='subtitle1'>10 товаров</Typography>
                </Stack>

                <Checkbox sx={{ alignSelf: 'flex-start' }} defaultChecked />
                Выбрать все
                <Stack spacing={1}>
                    {renderProductCards(10)}
                </Stack>
            </Grid >
            <Grid size={{ xs: 12, md: 4, lg: 4, xl: 6 }}>
                <OrderCard />
            </Grid>
        </Grid>
    )
};

export default Cart;
