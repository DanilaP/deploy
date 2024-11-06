import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import UserDataForm from "./user-data-form/user-data-form.tsx";
import DeliveryForm from "./delivery-methods/delivery-methods.tsx";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PaymentMethods from "./payment-methods/payment-methods.tsx";
import { useStore } from "../../stores";
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import CheckoutCard from "./checkout-card/checkout-card.tsx";
import ProductCard from "./product-card/product-card.tsx";
import './checkout-page.scss'
import $api from "../../configs/axiosconfig/axios.js";
import {ICourierFormData, IDeliveryData} from "../../interfaces/interfaces.ts";

const stores = [
    { id: '1', storeName: "ЭлектроМир", location: "Киевская улица, дом 5", storageDuration: "5 дней" },
    { id: '2', storeName: "ГаджетТочка", location: "Пушкинская улица, дом 10", storageDuration: "7 дней" },
    { id: '3', storeName: "ТехноГрад", location: "Ленинградский проспект, дом 20", storageDuration: "10 дней" },
    { id: '4', storeName: "Мир Электроники", location: "Тверская улица, дом 15", storageDuration: "4 дня" },
    { id: '5', storeName: "СмартЗона", location: "Невский проспект, дом 30", storageDuration: "3 дня" }
];

const deliveryDataCurrent = {
    "country": "Россия",
    "city": "Москва",
    "paymentMethod": "card",
    "paymentMethods": ["card", "cash", "spb"],
    "deliveryMethods": ["courier", "pickup"],
    "deliveryMethod": "pickup",
    "deliveryData": {
        storeId: '1',
        stores: stores,
        "courier": {
            address: 'г. Москва, Тверская улица',
            apartment: '12',
            entrance: '2',
            floor: '9',
            intercom: '1234',
            comment: 'Код домофона: 73',
        },
    },
};

const userDataCurrent = {
    name: "Svetlana",
    tel: "8 (926) 447-22-17"
};

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartStore, userStore } = useStore();
    const { cart } = cartStore;

    const [deliveryData, setDeliveryData] = useState<IDeliveryData>();
    const [name, setName] = useState('');
    const [tel, setTel] = useState('');

    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedDelivery, setSelectedDelivery] = useState('');
    const [courierFormData, setCourierFormData] = useState<ICourierFormData>();

    const [nameError, setNameError] = useState('');
    const [telError, setTelError] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [deliveryError, setDeliveryError] = useState('');

    const[isValidCheckoutData, setIsValidCheckoutData] = useState(true);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        setNameError('');
    };

    const handleTelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTel(event.target.value);
        setTelError('');
    };

    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.value);
        setPaymentError('');
    };

    const handleConfirmCheckout = () => {
        if (!name) {
            setIsValidCheckoutData(false);
            setNameError(t('text.checkout.errors.emptyName'));
        }

        if (!tel) {
            setIsValidCheckoutData(false);
            setTelError(t('text.checkout.errors.emptyTel'));
        }

        if (!selectedPayment) {
            setIsValidCheckoutData(false);
            setPaymentError(t('text.checkout.errors.emptyPaymentMethod'));
        }

        if (!selectedDelivery) {
            setIsValidCheckoutData(false);
            setDeliveryError(t('text.checkout.errors.emptyDeliveryMethod'));
        }
    };

    useEffect(() => {
        const fetchDeliveryData = async () => {
           const data = await $api.post('/delivery',  deliveryDataCurrent);
           setDeliveryData(data.data.delivery);
        };

        const fetchUserData = async() => {
            const data = await $api.post(`/user/${userStore.user?.id}`, userDataCurrent);
            setName(data.data.userData.name)
            setTel(data.data.userData.tel);
        };

        Promise.all([fetchUserData(), fetchDeliveryData()]);
    }, []);

    useEffect(() => {
        if (deliveryData) {
            setSelectedPayment(deliveryData.paymentMethod || '');
            setSelectedDelivery(deliveryData.deliveryMethod || '');
            setCourierFormData(deliveryData.deliveryData.courier);
        }
    }, [deliveryData]);

    return ( deliveryData &&
        <Container className="checkout-wrapper" maxWidth="lg">
            <Grid container rowSpacing={1} columnSpacing={2}>
                <Grid size={{ sm: 12, md: 8, lg: 8, xl: 6 }} gap={2}>
                    <Typography className="fw-bold" variant="h6" gutterBottom>
                        {t('text.checkout.orderCheckout')}
                    </Typography>

                    <Card className="card-wrapper">
                        <CardContent>
                            <Typography className="mb-2" variant="h6" gutterBottom>
                                {t('text.checkout.contactsData')}
                            </Typography>
                            <UserDataForm
                                name={name}
                                tel={tel}
                                nameError={nameError}
                                telError={telError}
                                handleNameChange={handleNameChange}
                                handleTelChange={handleTelChange}
                            />
                        </CardContent>
                    </Card>

                    <Card className="card-wrapper">
                        <CardContent>
                            <Typography variant="h6">
                                {t('text.checkout.deliveryVars')}
                            </Typography>
                            <Typography gutterBottom className="fs-16">
                                {t('text.checkout.shortInCity')} {deliveryData.city}
                            </Typography>
                            {courierFormData && <DeliveryForm
                              deliveryData={deliveryData.deliveryData}
                              selectedDelivery={selectedDelivery}
                              courierFormData={courierFormData}
                              setCourierFormData={setCourierFormData}
                              setSelectedDelivery={setSelectedDelivery}
                              deliveryError={deliveryError}
                              setDeliveryError={setDeliveryError}
                            />}

                        </CardContent>
                    </Card>

                    <Card className="card-wrapper">
                        <CardContent>
                            <Typography className="mb-2" variant="h6" gutterBottom>
                                {t('text.checkout.paymentVars')}
                            </Typography>
                            <PaymentMethods
                                selectedPayment={selectedPayment}
                                handlePaymentChange={handlePaymentChange}
                                paymentMethods={deliveryData.paymentMethods}
                                paymentError={paymentError}
                            />
                        </CardContent>
                    </Card>

                    <Typography className="mb-2" variant="h6" gutterBottom>
                        {t('text.checkout.selectedProducts')}
                    </Typography>
                    <Grid container spacing={2}>
                        {cart.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </Grid>
                </Grid>

                <Grid size={{ sm: 12, md: 4, lg: 4, xl: 6 }} gap={2} className="order-card-grid">
                    <CheckoutCard
                        selectedPayment={selectedPayment}
                        selectedDelivery={selectedDelivery}
                        handleConfirmCheckout={handleConfirmCheckout}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default observer(CheckoutPage);
