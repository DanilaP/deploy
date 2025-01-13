import { useTranslation } from "react-i18next";
import "./payments-chart-tooltip.scss";

export const PaymentsChartTooltip = (
    { active, payload, label }: 
    { payload: any[], label: string, active: true }
) => {

    const { t } = useTranslation();

    const getIntroOfPage = (label: string) => {
        if (label === t('text.checkout.paymentMethods.cash')) {
            return "cashInfo";
        }
        if (label === t('text.checkout.paymentMethods.spb')) {
            return "spbInfo";
        }
        if (label === t('text.checkout.paymentMethods.card')) {
            return "cardInfo";
        }
        return '';
    };
    
    if (active && payload && payload.length) {
        return (
            <div className="payment-chart-tooltip">
                <p className="label">{ `${payload[0].value}` }</p>
                <p className="intro">{ t(`text.${getIntroOfPage(label)}`) }</p>
            </div>
        );
    }  
    return null;
};