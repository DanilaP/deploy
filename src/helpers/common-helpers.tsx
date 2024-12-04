import { TFunction } from "i18next";
import { Typography } from "@mui/material";

const statusColors: { [key: string]: "warning" | "success" | "info" | "error" | "default" } = {
    waiting: "warning",
    delivered: "success",
    "in-transit": "info",
    cancelled: "error",
    default: "default",
};

export const getStatusColor = (status: string) => statusColors[status] || statusColors.default;

export const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).replace(',', '');
};

export const formatCurrency = (amount: number, locale = 'ru-RU') => amount.toLocaleString(locale);

export const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }
    return phone;
};

export const getFormattedAddressString = (addressFieldsData: any, t: TFunction, excludeFields: string[] = []) => {
    const formattedAddress = addressFieldsData.address ? addressFieldsData.address : '';
    const addressFields = Object.entries(addressFieldsData)
        .filter(([key, value]) => value && key !== 'address' && key !== 'id' && key !== 'comment')
        .map(([key, value]) => {
            const text = t(`text.checkout.courierFormLabels.${ key }`);
            return `${ text }: ${ value }`;
        })
        .join(', ');

    const comment = !excludeFields.includes('comment') && addressFieldsData.comment
        ? `${ t('text.checkout.courierFormLabels.comment') }: ${ addressFieldsData.comment }`
        : '';

    return (
        <>
            { formattedAddress && <Typography className="address">{ formattedAddress }</Typography> }
            { addressFields && <Typography className="address-fields">{ addressFields }</Typography> }
            { comment && <Typography className="comment">{ comment }</Typography> }
        </>
    );
};

