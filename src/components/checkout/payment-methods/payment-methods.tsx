import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { FormControlLabel, Radio, Typography } from "@mui/material";
import { FaCcVisa, FaCcMastercard, FaQrcode, FaMoneyBill } from 'react-icons/fa';
import './payment-methods.scss'
import { useTranslation } from "react-i18next";

interface PaymentFormProps {
    selectedPayment: string;
    handlePaymentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    paymentMethods: string[];
}

const paymentMethodsData = {
    card: {
        text: 'text.checkout.paymentMethods.card',
        icon: (
            <>
                <FaCcMastercard size={40} className="card-icon" />
                <FaCcVisa size={40} className="card-icon" />
            </>
        ),
    },

    cash: {
        text: 'text.checkout.paymentMethods.cash',
        icon: <FaMoneyBill size={40} className="card-icon" />
    },

    spb: {
        text: 'text.checkout.paymentMethods.spb',
        icon: <FaQrcode size={40} className="card-icon" />
    }
}
const PaymentMethods: React.FC<PaymentFormProps> = ({ selectedPayment, handlePaymentChange, paymentMethods}) => {
    const { t } = useTranslation();

    return (
        <Grid className="payment-form-wrapper mb-3" container spacing={2}>
            {paymentMethods.map((method) => {
                return (
                    <Grid size={{ xs:  12, sm:4 }}>
                        <Card className={`card-wrapper ${selectedPayment === method ? 'selected' : ''}`}>
                            <CardContent>
                                <FormControlLabel
                                    control={
                                        <Radio
                                            checked={selectedPayment === method}
                                            onChange={handlePaymentChange}
                                            value={method}
                                        />
                                    }
                                    label={
                                        <Typography variant="h6">
                                            {t(paymentMethodsData[method].text)}
                                        </Typography>
                                    }
                                />
                            </CardContent>

                            <CardContent>
                                {paymentMethodsData[method].icon}
                            </CardContent>
                        </Card>
                    </Grid>

                )
            })}
        </Grid>
    );
};

export default PaymentMethods;
