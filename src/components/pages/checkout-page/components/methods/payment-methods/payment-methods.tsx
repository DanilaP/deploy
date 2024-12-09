import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FormControlLabel, Radio, Typography } from "@mui/material";
import { FaCreditCard, FaQrcode, FaMoneyBill } from 'react-icons/fa';
import './payment-methods.scss';
import { useTranslation } from "react-i18next";
import { FC } from "react";

interface PaymentFormProps {
    selectedPayment: string;
    handleChange: (field:  "payment" | "delivery", value: string) => void;
    paymentError?: string;
}

const paymentMethodsData = {
    card: {
        text: 'text.checkout.paymentMethods.card',
        icon: (
            <>
                <FaCreditCard size={ 25 } className="card-icon" />
            </>
        ),
    },

    cash: {
        text: 'text.checkout.paymentMethods.cash',
        icon: <FaMoneyBill size={ 25 } className="card-icon" />
    },

    spb: {
        text: 'text.checkout.paymentMethods.spb',
        icon: <FaQrcode size={ 25 } className="card-icon" />
    }
};

type PaymentMethodKey = keyof typeof paymentMethodsData;
const PaymentMethods: FC<PaymentFormProps> = ({
    selectedPayment,
    handleChange,
    paymentError
}) => {
    const { t } = useTranslation();

    return (
        <Grid className="payment-form-wrapper" container spacing={ 2 }>
            { Object.keys(paymentMethodsData).map((method) => {
                const methodKey = method as PaymentMethodKey;

                return (
                    <Grid key={ method } size={ { xs:  12, sm: 4 } }>
                        <Card className={ `card-wrapper ${selectedPayment === method ? 'selected' : '' }` }>
                            <CardContent className="card-content-wrapper">
                                <FormControlLabel
                                    control={
                                        <Radio
                                            className="payment-method-radio"
                                            checked={ selectedPayment === method }
                                            onChange={ (e) => handleChange('payment', e.target.value) }
                                            value={ method }
                                        />
                                    }
                                    label={
                                        <Typography className="payment-method-text" variant="subtitle1">
                                            { t(paymentMethodsData[methodKey].text) }
                                        </Typography>
                                    }
                                />
                                <span className="payment-method-icon-wrapper">
                                   { paymentMethodsData[methodKey].icon }
                                </span>
                            </CardContent>

                        </Card>
                    </Grid>

                );
            }) }
            { paymentError && (
                <Typography className="payment-error" variant="body2">
                    { paymentError }
                </Typography>
            ) }
        </Grid>
    );
};

export default PaymentMethods;
