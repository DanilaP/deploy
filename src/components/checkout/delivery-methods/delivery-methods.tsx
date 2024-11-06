import { FC, useState} from 'react';
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

interface CourierFormData {
    address: string;
    apartment: string;
    entrance: string;
    floor: string;
    intercom: string;
    comment?: string;
}

interface Store {
    id: string;
    storeName: string;
    location: string;
    storageDuration: string;
}

interface DeliveryData {
    country: string;
    city: string;
    paymentMethod: string;
    paymentMethods: string[];
    deliveryMethod: string;
    deliveryData: {
        storeId: string;
        stores: Store[];
        courier: CourierFormData;
    };
}

interface DeliveryMethodsProps {
    deliveryData: DeliveryData;
    selectedDelivery: 'pickup' | 'courier';
    courierFormData: CourierFormData;
    setCourierFormData: CourierFormData;
    setSelectedDelivery: 'pickup' | 'courier';
}

const DeliveryMethods: FC<DeliveryMethodsProps> = ({ deliveryData, selectedDelivery, courierFormData, setCourierFormData, setSelectedDelivery }) => {
    const [openPickUpDialog, setOpenPickUpDialog] = useState(false);
    const [openCourierModal, setOpenCourierModal] = useState(false);

    const [selectedStoreId, setSelectedStoreId] = useState(deliveryData.storeId);
    const { t } = useTranslation();
    const currentStore = deliveryData.stores.find(({ id }) => id === selectedStoreId);

    const handleOpenPickUpDialog = () => {
        setOpenPickUpDialog(true);
    };

    const handleClosePickUpDialog = () => {
        setOpenPickUpDialog(false);
    };

    const handleOpenCourierDialog = () => {
        setOpenCourierModal(true);
    };

    const handleCloseCourierDialog = () => {
        setOpenCourierModal(false);
    };

    const handleChange = (field) => (event) => {
        setCourierFormData({
            ...courierFormData,
            [field]: event.target.value,
        });
    };

    const handleConfirm = (deliveryMethod: string) => {
        setOpenPickUpDialog(false);
        setOpenCourierModal(false);
        setSelectedDelivery(deliveryMethod);
    };

    return (
        <div className="delivery-methods-wrapper">
            <Stack direction="row" spacing={2} className="mt-3">
                <Button
                    variant={selectedDelivery === 'pickup' ? 'contained' : 'outlined'}
                    onClick={handleOpenPickUpDialog}
                >
                    {t('text.checkout.pickup')}
                </Button>
                <Button
                    variant={selectedDelivery === 'courier' ? 'contained' : 'outlined'}
                    onClick={handleOpenCourierDialog}
                >
                    {t('text.checkout.courierDelivery')}{t('text.checkout.byAddress')}
                </Button>
            </Stack>

            {selectedDelivery === 'pickup' && (
                <Card className="pickup-card">
                    <CardContent>
                        <Typography variant="h6" className="fs-20">
                            {t('text.checkout.pickupFromShop')} {currentStore.storeName} {t('text.checkout.byAddress')}:
                        </Typography>
                        <Typography variant="body1" className="mt-1">
                            {currentStore.location}
                        </Typography>
                        <Typography variant="body1" className="mt-1">
                            {t('text.checkout.orderStorageDuration')}: {currentStore.storageDuration}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {selectedDelivery === 'courier' && (
                <Card className="courier-card">
                    <CardContent>
                        <Typography variant="h6" className="fs-20 mb-1">
                            {t('text.checkout.courierDelivery')}
                        </Typography>
                        {`${t('text.checkout.courierFormLabels.address')}: ${deliveryData.courier.address}, 
                          ${t('text.checkout.courierFormLabels.apartment')}: ${deliveryData.courier.apartment}, 
                          ${t('text.checkout.courierFormLabels.entrance')}: ${deliveryData.courier.entrance}, 
                          ${t('text.checkout.courierFormLabels.floor')}: ${deliveryData.courier.floor}, 
                          ${t('text.checkout.courierFormLabels.intercom')}: ${deliveryData.courier.intercom}. 
                          ${deliveryData.courier.comment ? `${t('text.checkout.courierFormLabels.comment')}: ${deliveryData.courier.comment}` : ''}`}                    </CardContent>
                </Card>
            )}

            <PickupDialog
                handleClose={handleClosePickUpDialog}
                open={openPickUpDialog}
                selectedStoreId={selectedStoreId}
                stores={deliveryData.stores}
                handleConfirm={handleConfirm}
                setSelectedStoreId={setSelectedStoreId}
            />

            <CourierDialog
            open={openCourierModal}
            setOpenModal={setOpenCourierModal}
            handleChange={handleChange}
            handleConfirm={handleConfirm}
            courierFormData={courierFormData}
            handleClose={handleCloseCourierDialog}
            />
        </div>
    );
};

export default DeliveryMethods;
