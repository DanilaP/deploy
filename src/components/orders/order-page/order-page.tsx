import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import $api from "../../../configs/axiosconfig/axios.js";
import {
    Container,
    Typography,
    Button,
    CardActions,
    CardMedia,
    Link,
} from "@mui/material";
import OrderDetailsCard from "../cards/order-details-card/order-details-card.tsx";
import { IProduct, IVariation } from "../../../interfaces/interfaces.ts";
import Card from "@mui/material/Card";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdFavoriteBorder } from "react-icons/md";
import CardContent from "@mui/material/CardContent";
import { formatCurrency } from "../../../helpers/common-helpers.tsx";
import "./order-page.scss";
import Grid from "@mui/material/Grid2";
import PaymentDetailsCard from "../cards/payment-details-card/payment-details-card.tsx";

const OrderPage = () => {
    const query = useParams();
    const [order, setOrder] = useState<any>(null);
    const [productsData, setProductsData] = useState<any>([]);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const addToBacket = (id: number, variation: string) => {
            $api.post("/backet", { product: {
                    id,
                    number: 1,
                    variation,
                } })
                .catch((error) => {
                    console.error(error);
                });
    };

    useEffect(() => {
        Promise.all([
            $api.get(`/order/?id=${query.id}`),
            $api.get(`/products`),
        ])
            .then(([orderResponse, productsResponse]) => {
                const orderData = orderResponse.data.order;
                const products = productsResponse.data.products;

                const productsData = orderData.products.map((orderProduct) => {
                    const product = products.find((p: IProduct) => p.id === orderProduct.id);
                    const variation = product?.variations?.find((v: IVariation) => v.name === orderProduct.variation);
                    const { description } = product.additionalInfo.find(({ name }) => name === "Цвет");
                    return {
                        id: product?.id,
                        name: product?.name,
                        description: product?.description,
                        price: variation?.price,
                        img: variation?.images[0],
                        title: variation?.title,
                        color: description,
                        amount: orderProduct.amount,
                        variation: orderProduct.variation,
                    };
                });
                setOrder(orderData);
                setProductsData(productsData);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <Container className="order-container" maxWidth="xl">
            { order && (
                <>
                    <div className="link-wrapper">
                        <MdArrowBack className="link-icon" />
                        <Link className="back-link" href="/orders">
                            { t('text.toOrdersList') }
                        </Link>
                    </div>

                    <Grid container spacing={ 3 }>
                        <Grid size={ { xs: 12, md: 8, lg: 9 } }>
                            <OrderDetailsCard order={ order } />
                        </Grid>

                        <Grid size={ { xs: 12, md: 4, lg: 3 } }>
                            <PaymentDetailsCard productsData={ productsData } order={ order } />
                        </Grid>

                        <Grid size={ { xs: 12 } }>
                            <Card className="products-list-wrapper">
                                <div>
                                    <Button size="small" type="button" variant="outlined">
                                        { t('text.rateOrder') }
                                    </Button>
                                </div>
                                { productsData.map((product) => (
                                    <div className="product-item-wrapper" key={ product.id }>
                                        <CardContent className="product-data">
                                            <CardMedia
                                                onClick={ () => navigate(`/shop/product/${ product.id }`) }
                                                className="product-image"
                                                component="img"
                                                image={ product.img }
                                                alt={ product.description }
                                            />
                                            <div>
                                                <Typography variant="subtitle2">
                                                    { formatCurrency(product.price) } { t('text.rub') } x { product.amount } { t('text.pcs') }
                                                </Typography>
                                                <Typography variant="body2">
                                                    { product.name }, { product.title } { t('text.cart.variation') }
                                                </Typography>
                                                <Typography className="product-color" variant="caption">
                                                    { t('text.cart.color') }: { product.color }
                                                </Typography>
                                            </div>
                                        </CardContent>

                                        <CardActions className="product-actions">
                                            <Button size="small" color="secondary">
                                                <MdFavoriteBorder size={ 30 } />
                                            </Button>
                                            <Button
                                                onClick={ () => addToBacket(product.id, product.variation) }
                                                size="small"
                                                variant="contained"
                                            >
                                                { t('text.toBacket') }
                                            </Button>
                                        </CardActions>
                                    </div>
                                )) }
                            </Card>
                        </Grid>
                    </Grid>
                </>
            ) }
        </Container>
    );
};

export default OrderPage;
