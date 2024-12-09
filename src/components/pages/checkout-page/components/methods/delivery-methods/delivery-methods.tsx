import { FC, useEffect, useState } from 'react';
import {
    Button,
    Stack,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import PickupForm from "../../forms/pickup-form/pickup-form.tsx";
import CourierForm from "../../forms/courier-form/courier-form.tsx";
import './delivery-methods.scss';
import { useTranslation } from "react-i18next";
import { IAddress } from "../../../../../../interfaces/interfaces.ts";
import CustomModal from "../../../../../components-ui/custom-modal/custom-modal.tsx";
import { IPrevDelivery } from "../../../../../../models/user-delivery-data/user-delivery-data.ts";
import getFormattedAddressString from "../../../../../../helpers/utils/get-formatted-address-string.tsx";
import { IWarehouse } from '../../../../../../models/warehouse/warehouse.ts';

interface DeliveryMethodsProps {
    deliveryData: IPrevDelivery[];
    selectedDelivery: string;
    handleChange: (field:  "payment" | "delivery", value: string) => void;
    deliveryError?: string;
    wareHouses: Array<IWarehouse>;
}

const initialAddressFieldsData = {
    fullAddress: '',
    houseNumber: '',
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
  wareHouses,
}) => {
    const { t } = useTranslation();
    const [openDialogs, setOpenDialogs] = useState({
        pickup: false,
        courier: false,
    });

    const [selectedWareHouseId, setSelectedWareHouseId] = useState(deliveryData[0]?.wareHouseId || null);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);
    const [currentAddress, setCurrentAddress] = useState<IAddress>(initialAddressFieldsData);

    useEffect(() => {
        const filteredAddresses = deliveryData
            .filter((delivery: IPrevDelivery) => delivery.type === "courier")
            .map((delivery: IPrevDelivery) => ({
                ...delivery.address,
                comment: delivery.comment,
                id: delivery.id,
                fullAddress: delivery.address?.fullAddress || "",
            }));

        setAddresses(filteredAddresses);

        if (deliveryData.length > 0) {
            setCurrentAddressId(deliveryData[0].id);
            setCurrentAddress({
                ...deliveryData[0].address,
                comment: deliveryData[0].comment || "",
                id: deliveryData[0].id,
            });
        }
    }, [deliveryData]);


    const currentStore = wareHouses.find(({ id }) => id === selectedWareHouseId);
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

    const handleDeleteAddress = (addressId: number) => {
        if (currentAddressId === addressId) {
            return;
        }
        const updatedAddresses = addresses
            .filter((address: IAddress) => address.id !== addressId);
        setAddresses(updatedAddresses);
    };

    const handleSaveDeliveryAddressData = (deliveryMethod: string) => {
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
                            { t('text.checkout.pickupFromShop') } { currentStore?.name } { t('text.checkout.byAddress') }:
                        </Typography>
                        <Typography variant="body1" className="pickup-card-text">
                            { currentStore?.address }
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
                actionConfirmed={ () => handleCloseDialog('pickup') }
            >
                <PickupForm
                    handleClose={ () => handleCloseDialog('pickup') }
                    selectedWareHouseId={ selectedWareHouseId }
                    wareHouses={ wareHouses }
                    handleSaveDeliveryAddressData={ handleSaveDeliveryAddressData }
                    setSelectedWareHouseId={ setSelectedWareHouseId }
                />
            </CustomModal>

            <CustomModal
                isDisplay={ openDialogs.courier }
                title=""
                typeOfActions='none'
                closeModal={ () => handleCloseDialog('courier') }
                actionConfirmed={ () => handleCloseDialog('courier') }
            >
                <CourierForm
                    setCurrentAddress={ setCurrentAddress }
                    handleClose={ () => handleCloseDialog('courier') }
                    setAddresses={ setAddresses }
                    handleSaveDeliveryAddressData={ handleSaveDeliveryAddressData }
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

