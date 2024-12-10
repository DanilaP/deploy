import { TFunction } from "i18next/index";
import { Typography } from "@mui/material";

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

export default getFormattedAddressString;
