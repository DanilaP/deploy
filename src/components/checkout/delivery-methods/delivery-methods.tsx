import { FC , useState } from 'react';
import {
    Button,
    Stack,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import PickupForm from "./pickup-form/pickup-form.tsx";
import CourierForm from "./courier-form/courier-form.tsx";
import './delivery-methods.scss';
import { useTranslation } from "react-i18next";
import { IAddress, IPickUp } from "../../../interfaces/interfaces.ts";
import { getFormattedAddressString } from "../../../helpers/cart-helpers.tsx";
import CustomModal from "../../../components-ui/custom-modal/custom-modal.tsx";

interface DeliveryMethodsProps {
    deliveryData: any;
    selectedDelivery: string;
    handleChange: (field:  "payment" | "delivery", value: string) => void;
    deliveryError?: string;
    storesList: Array<IPickUp>;
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
  handleChange,
  deliveryError,
  storesList,
}) => {
    const { t } = useTranslation();
    const [openDialogs, setOpenDialogs] = useState({
        pickup: false,
        courier: false,
    });

    const [selectedStoreId, setSelectedStoreId] = useState(deliveryData.storeId);
    const [currentAddressId, setCurrentAddressId] = useState<string>(deliveryData.prevAddressId || '');
    const [addresses, setAddresses] = useState<IAddress[]>(deliveryData.addresses || []);
    const [currentAddress, setCurrentAddress] = useState<IAddress>(
        addresses.find((address) => address.id === deliveryData?.prevAddressId) ?? initialAddressFieldsData
    );

    const currentStore = storesList.find(({ id }) => id === selectedStoreId);
    const formattedAddress = currentAddress && getFormattedAddressString(currentAddress, t);

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

    const handleDeleteAddress = (addressId: string) => {
        if (currentAddressId === addressId) {
            return;
        }
        const updatedAddresses = addresses
            .filter((address: IAddress) => address.id !== addressId);
        setAddresses(updatedAddresses);
    };

    const handleSaveAddress = (deliveryMethod: string) => {
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

            <CustomModal
                isDisplay={ openDialogs.pickup }
                title = { t("text.checkout.chooseShop")  }
                typeOfActions='none'
                closeModal={ () => handleCloseDialog('pickup') }
            >
                <PickupForm
                    handleClose={ () => handleCloseDialog('pickup') }
                    selectedStoreId={ selectedStoreId }
                    stores={ storesList }
                    handleConfirm={ handleSaveAddress }
                    setSelectedStoreId={ setSelectedStoreId }
                />
            </CustomModal>

            <CustomModal
                isDisplay={ openDialogs.courier }
                title = ""
                typeOfActions='none'
                closeModal={ () => handleCloseDialog('courier') }
            >
                <CourierForm
                    setCurrentAddress={ setCurrentAddress }
                    handleClose={ () => handleCloseDialog('courier') }
                    setAddresses={ setAddresses }
                    handleConfirm={ handleSaveAddress }
                    addresses={ addresses }
                    currentAddress={ currentAddress }
                    setCurrentAddressId={ setCurrentAddressId }
                    currentAddressId={ currentAddressId }
                    handleDeleteAddress={ handleDeleteAddress }
                />
            </CustomModal>
        </div>
    );
};

export default DeliveryMethods;
