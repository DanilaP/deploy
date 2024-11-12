import {
    Button,
    Card,
    CardContent, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import { FC } from "react";
import './pickup-dialog.scss';
import { useTranslation } from "react-i18next";
import { IStore } from "../../../../interfaces/interfaces.ts";


interface PickupDialogProps {
    handleClose: () => void;
    open: boolean;
    selectedStoreId: string;
    setSelectedStoreId: (id: string) => void;
    stores: IStore[];
    handleConfirm: (deliveryMethod: string) => void;
}

const PickupDialog: FC<PickupDialogProps> = ({
  handleClose,
  open,
  selectedStoreId,
  setSelectedStoreId,
  stores,
  handleConfirm,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog className="pickup-dialog-wrapper" open={ open } onClose={ handleClose } maxWidth="sm" fullWidth>
            <DialogTitle>{ t('text.checkout.chooseShop') }</DialogTitle>
            <DialogContent>
                <RadioGroup
                    className="radio-group"
                    value={ selectedStoreId }
                    onChange={ (e) => setSelectedStoreId(e.target.value) }
                >
                    { stores.map((store) => (
                        <Card
                            key={ store.id }
                            className={ `store-card ${ selectedStoreId === store.id ? 'selected pickup-dialog-card' : 'pickup-dialog-card' }` }
                        >
                            <CardContent>
                                <FormControlLabel
                                    value={ store.id }
                                    control={ <Radio /> }
                                    label={
                                        <Typography variant="h6">
                                            { store.storeName }
                                        </Typography>
                                    }
                                />
                                <Typography variant="body2" color="textSecondary">
                                    { t('text.checkout.address') }: { store.location }
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    { t('text.checkout.storageDuration') }: { store.storageDuration }
                                </Typography>
                            </CardContent>
                        </Card>
                    )) }
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleClose }>{ t('text.cancel') }</Button>
                <Button
                    onClick={ () => handleConfirm('pickup') }
                    variant="contained"
                    disabled={ !selectedStoreId }
                >
                    { t('text.confirm') }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PickupDialog;
