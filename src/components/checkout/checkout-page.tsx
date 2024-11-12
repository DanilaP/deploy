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
import { useStore } from "../../stores";
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import ProductCard from "./product-card/product-card.tsx";
import './checkout-page.scss';
import { IAddressForm, IDeliveryData, IStore } from "../../interfaces/interfaces.ts";
import cartApi from "../../api/cart.ts";
import CheckoutCard from "./checkout-card/checkout-card.tsx";
import { formatCurrency, formatPhoneNumber } from "../../helpers/cart-helpers.tsx";
import UserData from "./user-data-form/user-data.tsx";
import { validateCheckout, validateUserForm } from "../../validationUtils.ts";

interface ValidationErrors {
    isErrors: boolean,
    errors: {
        name?: string;
        tel?: string;
        payment?: string;
        delivery?: string;
    }
}

const CheckoutPage = () => {
    const { t } = useTranslation();
    const { cartStore, userStore } = useStore();
    const { cart, totalSum, selectedTotalQuantity } = cartStore;

    const [deliveryData, setDeliveryData] = useState<IDeliveryData>();
    const [storesList, setStoresList] = useState<Array<IStore>>([]);
    const [userAddressesList, setUserAddressesList] = useState<IAddressForm[]>([]);

    const [name, setName] = useState(userStore?.user?.name || '');
    const [tel, setTel] = useState(userStore?.user?.tel || '');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedDelivery, setSelectedDelivery] = useState('');

    const [formErrors, setFormErrors] = useState<ValidationErrors>({
        isErrors: false,
        errors: {
            name: '',
            tel: '',
            payment: '',
            delivery: '',
        },
    });


    const fieldSetters = {
        name: setName,
        tel: setTel,
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

    const handleConfirmUserData = (): boolean => {
        const { isValid, errors } = validateUserForm(name, tel, t);
        if (isValid) {
            return true;
        }

        setFormErrors({
            isErrors: true,
            errors: errors,
        });

        return false;
    };

    const handleConfirmCheckout = (): boolean => {
        const {
            isValid,
            errors
        } = validateCheckout(name, tel, selectedDelivery, selectedPayment, t);

        if (isValid) {
            return true;
        }

        setFormErrors({
            isErrors: true,
            errors: errors,
        });

        return false;
    };

    useEffect(() => {
        const api = cartApi();
        const getData = async() => {
            try {
                const userId = userStore.user?.id;
                if (userId === null) {
                    console.error("Пользователь не авторизован");
                    return;
                }

                const [storesData, deliveryData] = await Promise.all([
                    api.getStoresList(),
                    api.getUserDeliveryData(Number(userId)),
                ]);
                setDeliveryData(deliveryData);
                setStoresList(storesData);
            } catch (error) {
                console.error(error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        if (deliveryData) {
            setSelectedPayment(deliveryData.prevPaymentMethod);
            setSelectedDelivery(deliveryData.prevDeliveryMethod);
            setUserAddressesList(deliveryData.prevDelivery.addresses);
        }
    }, [deliveryData]);

    const formattedTotalSum = formatCurrency(totalSum);

    return (deliveryData &&
        <Container className="checkout-wrapper" maxWidth="lg">
            <Grid container rowSpacing={ 1 } columnSpacing={ 2 }>
                <Grid size={ { sm: 12, md: 7, lg: 7, xl: 6 } } gap={ 2 } className="sticky-grid">

                  <Card className="card-wrapper">
                    <CardContent>
                      <Typography className="order-title" variant="h6">
                          { userStore?.user?.name && t('text.checkout.recipient') }
                      </Typography>
                      <Typography>
                          { name
                              ? `${name}, ${formatPhoneNumber(tel)}`
                              : t('text.checkout.insertRecipientData') }
                      </Typography>
                      <Box display="flex" justifyContent="flex-end">
                        <UserData
                          name={ name }
                          tel={ tel }
                          handleChange={ handleChange }
                          errors={ formErrors.errors }
                          handleConfirmUserData={ handleConfirmUserData }
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card className="card-wrapper">
                    <CardContent>
                      <Typography className="order-title" variant="h6">
                          { t('text.checkout.deliveryVars') }
                      </Typography>
                        <DeliveryForm
                          storesList={ storesList }
                          userAddressesList={ userAddressesList }
                          deliveryData={ deliveryData.prevDelivery }
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
                        { cart.map((product) => (
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
