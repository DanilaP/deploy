import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    CardActions,
    CardMedia,
} from "@mui/material";
import OrderDetailsCard from "../orders-page/components/cards/order-details-card/order-details-card.tsx";
import Card from "@mui/material/Card";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdFavoriteBorder } from "react-icons/md";
import CardContent from "@mui/material/CardContent";
import "./order-page.scss";
import Grid from "@mui/material/Grid2";
import PaymentDetailsCard from "../orders-page/components/cards/payment-details-card/payment-details-card.tsx";
import CustomModal from "../../components-ui/custom-modal/custom-modal.tsx";
import OrderRateForm from "../orders-page/components/order-rate-form/order-rate-form.tsx";
import OrderRateCard from "../orders-page/components/cards/order-rate-card/order-rate-card.tsx";
import { IProduct, IVariation } from "../../../models/products/products.ts";
import IOrder from "../../../models/order/order.ts";
import formatCurrency from "../../../helpers/utils/format-сurrency.ts";
import { addProductToUserBacket } from "../../../models/user/user-api.tsx";
import { getOrder } from "../../../models/order/order-api.ts";
import { getProducts } from "../../../models/products/products-api.ts";

const OrderPage = () => {
    const query = useParams();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [productsData, setProductsData] = useState<any>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const addToBacket = (id: number, variation: string) => {
        const productInfo = [ {
            id,
            number: 1,
            variation,
        } ];

        addProductToUserBacket(productInfo)
            .catch((error: unknown) => {
                console.error(error);
            });
    };

    useEffect(() => {
        Promise.all([
            getOrder(query.id!),
            getProducts(),
        ])
            .then(([orderResponse, productsResponse]) => {
                const products = productsResponse.data.products;

                const productsData = orderResponse.products.map((orderProduct) => {
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
                        number: orderProduct.number,
                        variation: orderProduct.variation,
                    };
                });
                setOrder(orderResponse);
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
                        <Link className="back-link" to="/orders">
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
                                    { order.orderStatus === 'delivered' && (
                                        <Button
                                            onClick={ () => setIsOpenModal(true) }
                                            size="small"
                                            type="button"
                                            variant="outlined"
                                        >
                                            { t('text.rateOrder') }
                                        </Button>
                                    ) }
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
                                                    { formatCurrency(product.price) } { t('text.rub') } x { product.number } { t('text.pcs') }
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

                    <CustomModal
                        isDisplay={ isOpenModal }
                        title=""
                        typeOfActions='none'
                        actionConfirmed={ () => setIsOpenModal(false) }
                        closeModal={ () => setIsOpenModal(false) }
                    >
                        <div>
                            <OrderRateCard order={ order } productsData={ productsData } />
                            <OrderRateForm closeModal={ () => setIsOpenModal(false) } />
                        </div>
                    </CustomModal>
                </>
            ) }
        </Container>
    );
};

export default OrderPage;
