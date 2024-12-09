import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../stores";
import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeliveryForm from "./components/methods/delivery-methods/delivery-methods.tsx";
import PaymentMethods from "./components/methods/payment-methods/payment-methods.tsx";
import ProductCard from "./components/cards/product-card/product-card.tsx";
import CheckoutCard from "./components/cards/checkout-card/checkout-card.tsx";
import CustomModal from "../../components-ui/custom-modal/custom-modal.tsx";
import UserDataForm from "./components/forms/user-data-form/user-data-form.tsx";
import { IWarehouse } from "../../../models/warehouse/warehouse.ts";
import { IPrevDelivery } from "../../../models/user-delivery-data/user-delivery-data.ts";
import { ICartProduct } from "../../../interfaces/interfaces.ts";
import { validateRequiredField } from "../../../helpers/validators/validators-helper.ts";
import formatPhoneNumber from "../../../helpers/utils/format-phone-number.ts";
import formatCurrency from "../../../helpers/utils/format-сurrency.ts";
import { getWarehouses } from "../../../models/warehouse/warehouse-api.ts";
import { getUserDeliveryData } from "../../../models/user-delivery-data/user-delivery-data-api.ts";
import { getUserBacketInfo } from "../../../models/user/user-api.tsx";
import './checkout-page.scss';

interface CheckoutPageValidationErrors {
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

    const [wareHouses, setWareHouses] = useState<Array<IWarehouse>>([]);
    const [prevDeliveries, setPrevDeliveries] = useState<IPrevDelivery[]>([]);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');

    const [checkoutPageErrors, setCheckoutPageErrors] = useState<CheckoutPageValidationErrors>({
        isErrors: false,
        errors: {
            payment: '',
            delivery: '',
        },
    });

    const fieldSetters = {
        payment: setSelectedPayment,
        delivery: setSelectedDeliveryMethod,
    };

    const handleChange = (field: keyof typeof fieldSetters, value: string) => {
        const fieldSetter = fieldSetters[field];
        if (fieldSetter) {
            fieldSetter(value);
        }

        setCheckoutPageErrors(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                [field]: '',
            }
        }));
    };

    const handleConfirmCheckout = (): boolean => {
        const isValidPaymentMethod = validateRequiredField(selectedPayment);
        const isValidDeliveryMethod = validateRequiredField(selectedDeliveryMethod);

        if (isValidPaymentMethod && isValidDeliveryMethod) {
            setCheckoutPageErrors({
                isErrors: false,
                errors: {
                    payment: '',
                    delivery: '',
                },
            });
            return true;
        }

        setCheckoutPageErrors({
            isErrors: true,
            errors: {
                payment: !isValidPaymentMethod ? t('text.checkout.errors.emptyPayment') : '',
                delivery: !isValidDeliveryMethod ? t('text.checkout.errors.emptyDelivery') : '',
            },
        });
        return false;
    };

    useEffect(() => {
        Promise.all([
            getWarehouses(),
            getUserDeliveryData(Number(userStore.user?.id)),
            getUserBacketInfo(),
        ])
            .then(([warehousesResponse, deliveryResponse, cartResponse]) => {
                if (deliveryResponse) {
                    const sortedDeliveries = deliveryResponse.prevDeliveries.sort(
                        (a: IPrevDelivery, b: IPrevDelivery) =>
                            new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
                    );
                    setPrevDeliveries(sortedDeliveries);
                    setSelectedPayment(sortedDeliveries[0]?.payment?.method || 'card');
                    setSelectedDeliveryMethod(sortedDeliveries[0]?.type || 'pickup');
                }

                setWareHouses(warehousesResponse.data.stores);
                cartStore.setCart(cartResponse.data.backet);
                cartStore.updateSelectionStatus();
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const [open, setOpen] = useState(false);

    const selectedProducts = cart.filter((product: ICartProduct) => selectedProductIds.includes(product.id));

    return (
        <Container className="checkout-wrapper" maxWidth="lg">
            <Grid container rowSpacing={ 1 } columnSpacing={ 2 }>
                <Grid size={ { sm: 12, md: 7, lg: 7, xl: 6 } } gap={ 2 }>

                  <Card className="card-wrapper">
                    <CardContent>
                      <Typography className="order-title" variant="h6">
                          { t('text.checkout.recipient') }
                      </Typography>
                      <Typography> { userStore?.user?.name }, { formatPhoneNumber(userStore?.user?.tel || '') }</Typography>
                      <Box className="user-data-form-wrapper">
                          <Button onClick={ () => setOpen(true) } color="primary" className="user-data-btn">
                              { t("text.checkout.editRecipient") }
                          </Button>
                          <CustomModal
                              isDisplay={ open }
                              title={ t("text.checkout.editRecipient") }
                              typeOfActions="none"
                              closeModal={ () => setOpen(false) }
                              actionConfirmed={ () => setOpen(false) }
                          >
                              <UserDataForm setOpen={ setOpen } />
                          </CustomModal>

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
                          deliveryData={ prevDeliveries }
                          handleChange={ handleChange }
                          selectedDelivery={ selectedDeliveryMethod }
                          deliveryError={ checkoutPageErrors.errors.delivery }
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
                        paymentError={ checkoutPageErrors.errors.payment }
                      />
                    </CardContent>
                  </Card>
                  <Card className="products-card-wrapper">
                    <Typography className="products-list-title" variant="subtitle1" gutterBottom>
                        { `${t('text.checkout.orderProcessing')} ${t('text.cart.productsCount.product', { count: selectedTotalQuantity }) } ` }
                        { t('text.checkout.forTotalSum') } { formatCurrency(totalSum) } <span className="total-price">{ t('text.rub') }</span>
                    </Typography>
                    <Grid container>
                        { selectedProducts.map((product) => (
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
                    selectedDelivery={ selectedDeliveryMethod }
                    handleConfirmCheckout={ handleConfirmCheckout }
                  />
                </Grid>
            </Grid>
        </Container>
    );
};

export default observer(CheckoutPage);
