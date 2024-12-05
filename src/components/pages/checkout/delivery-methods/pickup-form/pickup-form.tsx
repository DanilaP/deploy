import {
    Button,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import { FC, FormEvent } from "react";
import './pickup-form.scss';
import { useTranslation } from "react-i18next";
import { IStore } from "../../../../../interfaces/interfaces.ts";

interface PickupDialogProps {
    handleClose: () => void;
    selectedWareHouseId: number | null;
    setSelectedWareHouseId: (id: number) => void;
    wareHouses: IStore[];
    handleSaveDeliveryAddressData: (deliveryMethod: string) => void;
}

const PickupForm: FC<PickupDialogProps> = ({
  handleClose,
  selectedWareHouseId,
  setSelectedWareHouseId,
  wareHouses,
  handleSaveDeliveryAddressData,
}) => {
    const { t } = useTranslation();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSaveDeliveryAddressData('pickup');
    };

    return (
        <form onSubmit={ onSubmit } className="pickup-form-wrapper">
                <RadioGroup
                    className="radio-group"
                    value={ selectedWareHouseId }
                    onChange={ (e) => setSelectedWareHouseId(Number(e.target.value)) }
                >
                    { wareHouses.map((wareHouse: IStore) => (
                        <Card
                            key={ wareHouse.id }
                            className={ `store-card ${ selectedWareHouseId === wareHouse.id ? 'selected pickup-dialog-card' : 'pickup-dialog-card' }` }
                        >
                            <CardContent>
                                <FormControlLabel
                                    value={ wareHouse.id }
                                    control={ <Radio /> }
                                    label={
                                        <Typography variant="h6">
                                            { wareHouse.name }
                                        </Typography>
                                    }
                                />
                                <Typography variant="body2" color="textSecondary">
                                    { t('text.checkout.address') }: { wareHouse.address }
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
                    disabled={ !selectedWareHouseId }
                >
                    { t('text.confirm') }
                </Button>
            </div>
        </form>
    );
};

export default PickupForm;
