import {
    Button,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import { FC } from "react";
import './pickup-form.scss';
import { useTranslation } from "react-i18next";
import { IPickUp } from "../../../../interfaces/interfaces.ts";


interface PickupDialogProps {
    handleClose: () => void;
    selectedStoreId: string;
    setSelectedStoreId: (id: string) => void;
    stores: IPickUp[];
    handleConfirm: (deliveryMethod: string) => void;
}

const PickupForm: FC<PickupDialogProps> = ({
  handleClose,
  selectedStoreId,
  setSelectedStoreId,
  stores,
  handleConfirm,
}) => {
    const { t } = useTranslation();

    return (
        <form onSubmit={ () => handleConfirm('pickup') } className="pickup-form-wrapper">
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
            <div className="btn-wrapper">
                <Button onClick={ handleClose }>{ t('text.cancel') }</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={ !selectedStoreId }
                >
                    { t('text.confirm') }
                </Button>
            </div>

        </form>
    );
};

export default PickupForm;
