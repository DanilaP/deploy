import { ChangeEvent, FC, useEffect, useState } from 'react';
import {
    Button,
    Stack,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import PickupDialog from "./pickup-dialog/pickup-dialog.tsx";
import CourierDialog from "./courier-dialog/courier-dialog.tsx";
import './delivery-methods.scss';
import { useTranslation } from "react-i18next";
import { IAddressForm, IStore } from "../../../interfaces/interfaces.ts";
import { getFormattedAddressString } from "../../../helpers/cart-helpers.tsx";

interface DeliveryMethodsProps {
    deliveryData: any;
    selectedDelivery: string;
    userAddressesList: any;
    handleChange: (field: "name" | "payment" | "tel" | "delivery", value: string) => void;
    deliveryError?: string;
    storesList: Array<IStore>;
}

const initialAddressFieldsData = {
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
};

const DeliveryMethods: FC<DeliveryMethodsProps> = ({
  deliveryData,
  selectedDelivery,
  userAddressesList,
  handleChange,
  deliveryError,
  storesList,
}) => {
    const [openDialogs, setOpenDialogs] = useState({
        pickup: false,
        courier: false,
    });

    const [prevUserAddressId, setPrevUserAddressId] = useState(deliveryData.prevAddressId);
    const [selectedStoreId, setSelectedStoreId] = useState(deliveryData.storeId);
    const [addressFieldsData, setAddressFieldsData] = useState<IAddressForm>(initialAddressFieldsData);

    useEffect(() => {
        const prevAddressData = userAddressesList.find(({ id }: { id: string }) => id === prevUserAddressId);

        if (prevAddressData) {
            const { id, ...rest } = prevAddressData;
            setAddressFieldsData(rest);
        } else {
            setAddressFieldsData(initialAddressFieldsData);
        }
    }, [prevUserAddressId, userAddressesList]);

    const { t } = useTranslation();
    const currentStore = storesList.find(({ id }) => id === selectedStoreId);

    const formattedAddress = addressFieldsData && getFormattedAddressString(addressFieldsData, t);

    const handleOpenDialog = (dialog: 'pickup' | 'courier') => {
        setOpenDialogs((prev) => ({
            ...prev,
            [dialog]: true,
        }));
    };

    const handleCloseDialog = (dialog: 'pickup' | 'courier') => {
        setOpenDialogs((prev) => ({
            ...prev,
            [dialog]: false,
        }));
    };

    const handleChangeAddressFieldsData = (field: keyof IAddressForm) => (event: ChangeEvent<HTMLInputElement>) => {
        setAddressFieldsData({
            ...addressFieldsData,
            [field]: event.target.value,
        });
    };

    const handleConfirm = (deliveryMethod: string) => {
        handleCloseDialog('pickup');
        handleCloseDialog('courier');
        handleChange('delivery', deliveryMethod);
    };

    return (
        <div className="delivery-methods-wrapper">
            <Stack direction="row" spacing={ 2 } className="buttons-stack">
                <Button
                    size="small"
                    variant={ selectedDelivery === 'pickup' ? 'contained' : 'outlined' }
                    onClick={ () => handleOpenDialog('pickup') }
                >
                    { t('text.checkout.pickup') }
                </Button>
                <Button
                    size="small"
                    variant={ selectedDelivery === 'courier' ? 'contained' : 'outlined' }
                    onClick={ () => handleOpenDialog('courier') }
                >
                    { t('text.checkout.courierDelivery') }
                </Button>
            </Stack>

            { selectedDelivery === 'pickup' && (
                <Card className="pickup-card">
                    <CardContent>
                        <Typography variant="h6" className="pickup-card-header">
                            { t('text.checkout.pickupFromShop') } { currentStore?.storeName } { t('text.checkout.byAddress') }:
                        </Typography>
                        <Typography variant="body1" className="pickup-card-text">
                            { currentStore?.location }
                        </Typography>
                        <Typography variant="body1" className="pickup-card-text order-duration">
                            { t('text.checkout.orderStorageDuration') }: <span>{ currentStore?.storageDuration }</span>
                        </Typography>
                    </CardContent>
                </Card>
            ) }

            { selectedDelivery === 'courier' && (
                <Card className="address-card">
                    <CardContent>
                        { formattedAddress }
                    </CardContent>
                </Card>
            ) }

            { deliveryError && (
                <Typography className="delivery-error" variant="body2">
                    { deliveryError }
                </Typography>
            ) }

            <PickupDialog
                handleClose={ () => handleCloseDialog('pickup') }
                open={ openDialogs.pickup }
                selectedStoreId={ selectedStoreId }
                stores={ storesList }
                handleConfirm={ handleConfirm }
                setSelectedStoreId={ setSelectedStoreId }
            />

            <CourierDialog
                handleClose={ () => handleCloseDialog('courier') }
                open={ openDialogs.courier }
                handleChange={ handleChangeAddressFieldsData }
                handleConfirm={ handleConfirm }
                addresses={ deliveryData.addresses }
                addressFieldsData={ addressFieldsData }
                setPrevUserAddressId={ setPrevUserAddressId }
                prevUserAddressId={ prevUserAddressId }
            />
        </div>
    );
};

export default DeliveryMethods;
