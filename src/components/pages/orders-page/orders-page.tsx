import { useEffect, useState } from "react";
import { useStore } from "../../../stores/index.ts";
import { Container, Card, CardContent, Typography, Button } from "@mui/material";
import PreviewCard from "./components/cards/preview-card/preview-card.tsx";
import { useTranslation } from "react-i18next";
import "./orders-page.scss";
import { useNavigate } from "react-router";
import { IProduct } from "../../../models/products/products.ts";
import IOrder from "../../../models/order/order.ts";
import { getProducts } from "../../../models/products/products-api.ts";
import { getOrders } from "../../../models/orders/orders-api.ts";
import IOrders from "../../../models/orders/orders.ts";

const OrdersPage = () => {
    const [orders, setOrders] = useState<IOrders>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const { userStore } = useStore();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            getOrders(),
            getProducts(),
        ])
            .then(([ordersResponse, productsResponse]) => {
                const orders: IOrders = ordersResponse
                    .filter(({ userId }) => userId === userStore?.user?.id);
                setOrders(orders);
                setProducts(productsResponse.data.products);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <Container className="orders-container" maxWidth="lg">
            <h1>{ t('text.myOrders') }</h1>
            <Card className="orders-card">
                <CardContent className="orders-card-content">
                    { orders.length === 0 ? (
                        <>
                            <Typography variant="h6" color="textSecondary">
                                { t('text.noOrders') }
                            </Typography>
                            <Button onClick={ () => navigate('/shop') } variant="contained" >{ t('text.goToShopping') }</Button>
                        </>
                    ) : (
                        orders.map((order: IOrder) => (
                            <PreviewCard
                                key={ order.orderId }
                                order={ order }
                                products={ products }
                            />
                        ))
                    ) }
                </CardContent>
            </Card>
        </Container>
    );
};

export default OrdersPage;
