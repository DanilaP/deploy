import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField, Typography,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IAddress } from "../../../../interfaces/interfaces.ts";
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from 'react-dadata';
import { getFormattedAddressString } from "../../../../helpers/cart-helpers.tsx";
import 'react-dadata/dist/react-dadata.css';
import './courier-dialog.scss';
import IconButton from "@mui/material/IconButton";
import { FaTimes } from 'react-icons/fa';
import _ from 'lodash';


interface CourierDialogProps {
    currentAddress: IAddress | null;
    open: boolean;
    handleClose: () => void;
    handleChange: (field: keyof IAddress) => (event: ChangeEvent<HTMLInputElement>) => void;
    handleConfirm: (data: string) => void;
    addresses: IAddress[];
    currentAddressId: string;
    setCurrentAddressId: (id: string) => void;
    handleDeleteAddress: (id: string ) => void;
    setCurrentAddress: (e: IAddress) => void;
    setAddresses: (addresses: any) => void;
}

const DA_DATA_API_KEY = import.meta.env.VITE_APP_DA_DATA_API_KEY;

const CourierDialog: FC<CourierDialogProps> = ({
  open,
  handleClose,
  addresses,
  setAddresses,
  handleChange,
  handleConfirm,
  currentAddress,
  setCurrentAddress,
  currentAddressId,
  setCurrentAddressId,
  handleDeleteAddress,
}) => {
    const { t } = useTranslation();
    const [prevSelectedAddress, setPrevSelectedAddress] = useState(currentAddress);

    const handleSelectAddressChange = (event) => {
        const selectedAddressId = event.target.value;
        const newSelectedAddress = addresses
            .find(({ id }) => id === selectedAddressId);

        if (newSelectedAddress) {
            setPrevSelectedAddress(newSelectedAddress);
            setCurrentAddress(newSelectedAddress);
            setCurrentAddressId(selectedAddressId);
        }
    };

    const [daDataFieldValue, setDaDataFieldValue] = useState<DaDataSuggestion<DaDataAddress> | undefined>();

    useEffect(() => {
        if (daDataFieldValue) {
            setCurrentAddress((prev: IAddress) => ({ ...prev, address: daDataFieldValue.value }));
        }
    }, [daDataFieldValue]);


    const filterEmptyEntries = (obj: Record<string, any>) =>
        Object.entries(obj).filter(([, value]) => value);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const filteredCurrentAddressEntries = filterEmptyEntries(currentAddress);
        const filteredPrevSelectedAddressEntries = filterEmptyEntries(prevSelectedAddress);

        if (!_.isEqual(filteredCurrentAddressEntries, filteredPrevSelectedAddressEntries)) {
            const newId = _.uniqueId('2');
            const newAddress: IAddress = { ...currentAddress, id: newId };

            setCurrentAddressId(newId);
            setCurrentAddress(newAddress);
            setAddresses((prevAddresses: IAddress[]) => [...prevAddresses, newAddress]);
        }

        handleConfirm('courier');
    };



    return (
            <Dialog className="courier-dialog-wrapper" open={ open } onClose={ handleClose } maxWidth="sm" fullWidth>
                <form onSubmit={ onSubmit }>
                { addresses.length > 0 &&
                  <FormControl className="form-control"  variant="outlined">
                    <InputLabel>{ t('text.checkout.selectAddress') }</InputLabel>
                    <Select
                      onChange={ handleSelectAddressChange }
                      MenuProps={ {
                          classes: {
                              paper: "custom-select-menu",
                          },
                      } }
                      className="select-wrapper"
                      label={ t('text.checkout.selectAddress') }
                      value={ currentAddress?.id || '' }
                      renderValue={ () => `${currentAddress?.address}, ${currentAddress?.houseNumber || ''}, кв. ${currentAddress?.apartment}` }
                    >
                        { addresses.map((address, index) => (
                            <MenuItem
                                className="select-item"
                                key={ index }
                                value={ address?.id || '' }
                            >
                                <div className="address-wrapper">
                                    <Stack direction="column">
                                        { getFormattedAddressString(address, t) }
                                    </Stack>
                                    <IconButton
                                        className={ `delete-icon ${ address.id === currentAddressId ? 'hidden' : 'visible' }` }
                                        onClick={ (e) => {
                                            e.stopPropagation();
                                            handleDeleteAddress(address.id);
                                        } }
                                        size="small"
                                    >
                                        <FaTimes size={ 20 } />
                                    </IconButton>
                                </div>
                            </MenuItem>
                        )) }
                    </Select>
                  </FormControl>
                }

                <DialogContent>
                    <Typography variant="subtitle1">{ t('text.checkout.deliveryAddress') }</Typography>
                    <Stack className="dialog-content" spacing={ 2 }>

                        <AddressSuggestions
                            token={ DA_DATA_API_KEY }
                            defaultQuery={ currentAddress?.address }
                            value={ { value: currentAddress?.address } }
                            inputProps={ {
                                required: true,
                                placeholder: t('text.checkout.courierFormLabels.address'),
                                onChange: handleChange('address'),
                                error: String(!!daDataFieldValue?.value || !currentAddress?.address)
                            } }
                            onChange={ setDaDataFieldValue }
                        />
                        <Stack className="stack-wrapper" direction="row" spacing={ 2 }>
                            <TextField
                                label={ t('text.checkout.courierFormLabels.houseNumber') }
                                variant="outlined"
                                value={ currentAddress?.houseNumber || '' }
                                onChange={ handleChange('houseNumber') }
                                fullWidth
                            />
                            <TextField
                                label={ t('text.checkout.courierFormLabels.entrance') }
                                variant="outlined"
                                value={ currentAddress?.entrance || '' }
                                onChange={ handleChange('entrance') }
                                fullWidth
                            />
                            <TextField
                                label={ t('text.checkout.courierFormLabels.apartment') }
                                variant="outlined"
                                value={ currentAddress?.apartment || '' }
                                onChange={ handleChange('apartment') }
                                fullWidth
                            />
                        </Stack>
                        <Stack direction="row" spacing={ 2 }>
                            <TextField
                                label={ t('text.checkout.courierFormLabels.floor') }
                                variant="outlined"
                                value={ currentAddress?.floor || '' }
                                onChange={ handleChange('floor') }
                                fullWidth
                            />
                            <TextField
                                fullWidth
                                label={ t('text.checkout.courierFormLabels.intercom') }
                                variant="outlined"
                                value={ currentAddress?.intercom || '' }
                                onChange={ handleChange('intercom') }
                            />
                        </Stack>
                        <TextField
                            label={ t('text.checkout.courierFormLabels.comment') }
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={ 4 }
                            value={ currentAddress?.comment || '' }
                            onChange={ handleChange('comment') }
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleClose }> { t('text.cancel') }</Button>
                    <Button variant="contained" type="submit">
                        { t('text.confirm') }
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
    );
};

export default CourierDialog;
