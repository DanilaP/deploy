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
import { ICourierFormData, IDeliveryData } from "../../../interfaces/interfaces.ts";


interface DeliveryMethodsProps {
    deliveryData: IDeliveryData;
    selectedDelivery: 'pickup' | 'courier';
    courierFormData: ICourierFormData;
    setCourierFormData: (data: ICourierFormData) => void;
    setSelectedDelivery: (data: string) => void;
    deliveryError: string;
    setDeliveryError: (data: string) => void;
}

const DeliveryMethods: FC<DeliveryMethodsProps> = ({
  deliveryData,
  selectedDelivery,
  courierFormData,
  setCourierFormData,
  setSelectedDelivery,
  deliveryError,
  setDeliveryError,
}) => {
    const [openPickUpDialog, setOpenPickUpDialog] = useState(false);
    const [openCourierModal, setOpenCourierModal] = useState(false);

    const [selectedStoreId, setSelectedStoreId] = useState(deliveryData.storeId);
    const { t } = useTranslation();
    const currentStore = deliveryData.stores.find(({ id }) => id === selectedStoreId);

    const courierDetails = Object.entries(deliveryData.courier)
        .filter(([, value]) => value)
        .map(([key, value]) => {
            const text = t(`text.checkout.courierFormLabels.${key}`);
            return `${text}: ${value}`;
        })
        .join(', ');

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

    const handleChange = (field: keyof ICourierFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setCourierFormData({
            ...courierFormData,
            [field]: event.target.value,
        });
    };

    const handleConfirm = (deliveryMethod: string) => {
        setOpenPickUpDialog(false);
        setOpenCourierModal(false);
        setSelectedDelivery(deliveryMethod);
        setDeliveryError('');
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
                        {courierDetails}
                    </CardContent>
                </Card>
            )}

            {deliveryError && (
                <Typography color="error" variant="body2">
                    {deliveryError}
                </Typography>
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
