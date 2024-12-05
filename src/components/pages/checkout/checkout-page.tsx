import {
    Box,
    Container,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DeliveryForm from "./delivery-methods/delivery-methods.tsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PaymentMethods from "./payment-methods/payment-methods.tsx";
import { useStore } from "../../../stores/index.ts";
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import ProductCard from "./product-card/product-card.tsx";
import './checkout-page.scss';
import { IPrevDelivery } from "../../../interfaces/interfaces.ts";
import cartApi from "../../../api/cart.ts";
import CheckoutCard from "./checkout-card/checkout-card.tsx";
import { formatCurrency, formatPhoneNumber } from "../../../helpers/cart-helpers.tsx";
import UserData from "./user-data-form/user-data.tsx";
import { validateRequiredField } from "../../../validators-helper.tsx";
import { IWarehouse } from "../../../models/warehouse/warehouse.ts";
import { IProduct } from "../../../models/products/products.ts";

interface ValidationErrors {
    isErrors: boolean,
    errors: {
        payment?: string;
        delivery?: string;
    }
}

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartStore, userStore } = useStore();
    const {
        cart,
        totalSum,
        selectedTotalQuantity ,
        selectedProductIds,
    } = cartStore;

    const [deliveryData, setDeliveryData] = useState<IPrevDelivery[] | null>(null);
    const [wareHouses, setWareHouses] = useState<Array<IWarehouse>>([]);

    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedDelivery, setSelectedDelivery] = useState('');

    const [formErrors, setFormErrors] = useState<ValidationErrors>({
        isErrors: false,
        errors: {
            payment: '',
            delivery: '',
        },
    });

    const fieldSetters = {
        payment: setSelectedPayment,
        delivery: setSelectedDelivery,
    };

    const handleChange = (field: keyof typeof fieldSetters, value: string) => {
        const fieldSetter = fieldSetters[field];
        if (fieldSetter) {
            fieldSetter(value);
        }

        setFormErrors(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                [field]: '',
            }
        }));
    };

    const handleConfirmCheckout = (): boolean => {
        const isValidPaymentMethod = validateRequiredField(selectedPayment);
        const isValidDeliveryMethod = validateRequiredField(selectedDelivery);

        if (isValidPaymentMethod && isValidDeliveryMethod) {
            setFormErrors({
                isErrors: false,
                errors: {
                    payment: '',
                    delivery: '',
                },
            });
            return true;
        }

        setFormErrors({
            isErrors: true,
            errors: {
                payment: !isValidPaymentMethod ? t('text.checkout.errors.emptyPayment') : '',
                delivery: !isValidDeliveryMethod ? t('text.checkout.errors.emptyDelivery') : '',
            },
        });
        return false;
    };

    useEffect(() => {
        const api = cartApi();

        Promise.all([
            api.getWareHouses(),
            api.getUserDeliveryData(Number(userStore.user?.id)),
            api.getUserCart(),
        ])
            .then(([warehousesData, deliveryData, basketData]) => {
                const sortedDeliveries = deliveryData.prevDeliveries
                    .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

                setDeliveryData(sortedDeliveries);
                setWareHouses(warehousesData);
                setSelectedPayment(sortedDeliveries[0]?.payment?.method || '');
                setSelectedDelivery(sortedDeliveries[0]?.type || '');
                cartStore.setCart(basketData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    const formattedTotalSum = formatCurrency(totalSum);

    const filteredCart = cart.filter((product: IProduct) => selectedProductIds.includes(product.id));

    return (deliveryData &&
        <Container className="checkout-wrapper" maxWidth="lg">
            <Grid container rowSpacing={ 1 } columnSpacing={ 2 }>
                <Grid size={ { sm: 12, md: 7, lg: 7, xl: 6 } } gap={ 2 }>

                  <Card className="card-wrapper">
                    <CardContent>
                      <Typography className="order-title" variant="h6">
                          { t('text.checkout.recipient') }
                      </Typography>
                      <Typography> { userStore?.user?.name }, { formatPhoneNumber(userStore?.user?.tel || '') }</Typography>
                      <Box display="flex" justifyContent="flex-end">
                        <UserData />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card className="card-wrapper">
                    <CardContent>
                      <Typography className="order-title" variant="h6">
                          { t('text.checkout.deliveryVars') }
                      </Typography>
                        <DeliveryForm
                          wareHouses={ wareHouses }
                          deliveryData={ deliveryData }
                          handleChange={ handleChange }
                          selectedDelivery={ selectedDelivery }
                          deliveryError={ formErrors.errors.delivery }
                        />
                    </CardContent>
                  </Card>

                  <Card className="card-wrapper">
                    <CardContent>
                      <Typography className="order-title" variant="h6" gutterBottom>
                          { t('text.checkout.paymentVars') }
                      </Typography>
                      <PaymentMethods
                        selectedPayment={ selectedPayment }
                        handleChange={ handleChange }
                        paymentError={ formErrors.errors.payment }
                      />
                    </CardContent>
                  </Card>
                  <Card className="products-card-wrapper">
                    <Typography className="products-list-title" variant="subtitle1" gutterBottom>
                        { t('text.checkout.orderProcessing') }
                        { ' ' }
                        { t('text.cart.productsCount.product', { count: selectedTotalQuantity }) }
                        { ' ' }
                        { t('text.checkout.forTotalSum') } { formattedTotalSum } <span className="total-price">{ t('text.rub') }</span>
                    </Typography>
                    <Grid container>
                        { filteredCart.map((product) => (
                            <ProductCard
                                key={ product.id }
                                product={ product }
                            />
                        )) }
                    </Grid>
                  </Card>
                </Grid>

                <Grid className="sticky-grid" size={ { sm: 12, md: 4, lg: 4, xl: 6 } }>
                  <CheckoutCard
                    selectedPayment={ selectedPayment }
                    selectedDelivery={ selectedDelivery }
                    handleConfirmCheckout={ handleConfirmCheckout }
                  />
                </Grid>
            </Grid>
        </Container>
    );
};

export default observer(CheckoutPage);
