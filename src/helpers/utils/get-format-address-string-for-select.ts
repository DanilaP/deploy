import { IAddress } from "../../interfaces/interfaces.ts";
import { TFunction } from "i18next/index";

const getFormatAddressStringForSelect = (addressFieldsData: IAddress, t: TFunction) => {
    return Object.entries(addressFieldsData)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => {
            const text = t(`text.checkout.courierFormLabels.${ key }`);
            return `${ text }: ${ value }`;
        })
        .join(', ')
        .slice(0, 50)
};

export default getFormatAddressStringForSelect;
