import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import './courier-dialog.scss';
import { ICourierFormData } from "../../../../interfaces/interfaces.ts";

interface CourierDialogProps {
    open: boolean;
    handleClose: () => void;
    courierFormData: ICourierFormData;
    handleChange: (field: keyof ICourierFormData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleConfirm: (data: string) => void;
}

const CourierDialog:FC<CourierDialogProps> = ({
  open,
  handleClose,
  courierFormData,
  handleChange,
  handleConfirm,
}) => {
    const { t } = useTranslation();
    return (
        <Dialog className="courier-dialog-wrapper" open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('text.checkout.enterDeliveryAddress')}</DialogTitle>
            <DialogContent>
                <Stack className="dialog-content" spacing={2}>
                    <TextField
                        label={t('text.checkout.courierFormLabels.address')}
                        variant="outlined"
                        fullWidth
                        value={courierFormData.address}
                        onChange={handleChange('address')}
                        required
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label={t('text.checkout.courierFormLabels.apartment')}
                            variant="outlined"
                            value={courierFormData.apartment}
                            onChange={handleChange('apartment')}
                            required
                            fullWidth
                        />
                        <TextField
                            label={t('text.checkout.courierFormLabels.entrance')}
                            variant="outlined"
                            value={courierFormData.entrance}
                            onChange={handleChange('entrance')}
                            required
                            fullWidth
                        />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label={t('text.checkout.courierFormLabels.floor')}
                            variant="outlined"
                            value={courierFormData.floor}
                            onChange={handleChange('floor')}
                            required
                            fullWidth
                        />
                        <TextField
                            fullWidth
                            label={t('text.checkout.courierFormLabels.intercom')}
                            variant="outlined"
                            value={courierFormData.intercom}
                            onChange={handleChange('intercom')}
                        />
                    </Stack>
                    <TextField
                        label={t('text.checkout.courierFormLabels.comment')}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={courierFormData.comment}
                        onChange={handleChange('comment')}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}> {t('text.cancel')}</Button>
                <Button
                    onClick={() => handleConfirm('courier')}
                    variant="contained"
                    disabled={!courierFormData.address}
                >
                    {t('text.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourierDialog;
