import { IAddress } from "../interfaces/interfaces.ts";
import { TFunction } from "i18next";
import { Typography } from "@mui/material";

export const formatCurrency = (amount: number, locale = 'ru-RU') => amount.toLocaleString(locale);

export const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }
    return phone;
};

export const getFormatAddressStringForSelect = (addressFieldsData: IAddress, t: TFunction) => {
    return Object.entries(addressFieldsData)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => {
            const text = t(`text.checkout.courierFormLabels.${ key }`);
            return `${ text }: ${ value }`;
        })
        .join(', ')
        .slice(0, 50)
};

export const getFormattedAddressString = (addressFieldsData: IAddress, t: TFunction, excludeFields: string[] = []) => {
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





