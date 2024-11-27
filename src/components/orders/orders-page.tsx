import { useEffect, useState } from "react";
import $api from "../../configs/axiosconfig/axios.js";
import { useStore } from "../../stores";
import { Container, Card, CardContent } from "@mui/material";
import PreviewCard from "./cards/preview-card/preview-card.tsx";
import { IOrder, IProduct } from "../../interfaces/interfaces.ts";
import { useTranslation } from "react-i18next";
import "./orders-page.scss";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const { userStore } = useStore();
    const { t } = useTranslation();

    useEffect(() => {
        Promise.all([
            $api.get('/orders'),
            $api.get(`/products`)
        ])
            .then(([ordersResponse, productsResponse]) => {
                const orders = ordersResponse.data
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
                    { orders.map((order: IOrder) => (
                        <PreviewCard
                            key={ order.orderId }
                            order={ order }
                            products={ products }
                        />
                    )) }
                </CardContent>
            </Card>
        </Container>
    );
};

export default OrdersPage;
