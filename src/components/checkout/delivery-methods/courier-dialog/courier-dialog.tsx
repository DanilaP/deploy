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
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IAddressForm } from "../../../../interfaces/interfaces.ts";
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from 'react-dadata';
import { getFormattedAddressString } from "../../../../helpers/cart-helpers.tsx";
import 'react-dadata/dist/react-dadata.css';
import './courier-dialog.scss';

interface CourierDialogProps {
    addressFieldsData: IAddressForm | null;
    open: boolean;
    handleClose: () => void;
    handleChange: (field: keyof IAddressForm) => (event: ChangeEvent<HTMLInputElement>) => void;
    handleConfirm: (data: string) => void;
    addresses: IAddressForm[];
    prevUserAddressId: string,
    setPrevUserAddressId: (id: string) => void,
}

interface DaDataSuggestion<T> {
    value: string;
    unrestricted_value: string;
    data: T;
}

const DA_DATA_API_KEY = import.meta.env.VITE_APP_DA_DATA_API_KEY;

const CustomMUITextField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => {
        return (
            <TextField
                { ...props }
                ref={ ref }
                variant="outlined"
                fullWidth
            />
        );
    }
);


const CourierDialog: FC<CourierDialogProps> = ({
  open,
  handleClose,
  addresses,
  handleChange,
  handleConfirm,
  addressFieldsData,
  prevUserAddressId,
  setPrevUserAddressId,
}) => {
    const { t } = useTranslation();
    const [selectedAddress, setSelectedAddress] = useState<DaDataSuggestion<DaDataAddress> | undefined>(undefined);

    useEffect(() => {
        if (addresses && addresses.length > 0) {
            setSelectedAddress({ value: addresses[0].address, unrestricted_value: '', data: {} });
        }
    }, [addresses]);

    const handleChangeAddress = (suggestionAddress?: DaDataSuggestion<DaDataAddress>) => {
        if (suggestionAddress && suggestionAddress.value) {
            setSelectedAddress(suggestionAddress);
            handleChange('address')({ target: { value: suggestionAddress.value } } as ChangeEvent<HTMLInputElement>);
        }
    };

    const handleSelectAddressChange = (event: any) => {
        setPrevUserAddressId(event.target.value);
        const newSelectedAddress = addresses
            .find(({ id }) => id === event.target.value);

            if (newSelectedAddress) {
                handleChangeAddress({ value: newSelectedAddress.address, unrestricted_value: '', data: {} });
            }
    };

    return (
        <Dialog className="courier-dialog-wrapper" open={ open } onClose={ handleClose } maxWidth="sm" fullWidth>
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
                  value={ prevUserAddressId }
                  renderValue={ ( ) => '' }
                >
                    { addresses.map((address, index) => (
                        <MenuItem
                            className="select-item"
                            key={ index }
                            value={ address.id }
                        >
                            <Stack direction="column" className="address-wrapper">
                                { getFormattedAddressString(address, t) }
                            </Stack>
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
                        defaultQuery={ addressFieldsData?.address }
                        value={ selectedAddress }
                        inputProps={ {
                            label: t('text.checkout.courierFormLabels.address'),
                        } }
                        onChange={ handleChangeAddress }
                        customInput={ CustomMUITextField }
                    />

                    <Stack className="c" direction="row" spacing={ 2 }>
                        <TextField
                            label={ t('text.checkout.courierFormLabels.apartment') }
                            variant="outlined"
                            value={ addressFieldsData?.apartment }
                            onChange={ handleChange('apartment') }
                            fullWidth
                        />
                        <TextField
                            label={ t('text.checkout.courierFormLabels.entrance') }
                            variant="outlined"
                            value={ addressFieldsData?.entrance }
                            onChange={ handleChange('entrance') }
                            fullWidth
                        />
                    </Stack>
                    <Stack direction="row" spacing={ 2 }>
                        <TextField
                            label={ t('text.checkout.courierFormLabels.floor') }
                            variant="outlined"
                            value={ addressFieldsData?.floor }
                            onChange={ handleChange('floor') }
                            fullWidth
                        />
                        <TextField
                            fullWidth
                            label={ t('text.checkout.courierFormLabels.intercom') }
                            variant="outlined"
                            value={ addressFieldsData?.intercom }
                            onChange={ handleChange('intercom') }
                        />
                    </Stack>
                    <TextField
                        label={ t('text.checkout.courierFormLabels.comment') }
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={ 4 }
                        value={ addressFieldsData?.comment }
                        onChange={ handleChange('comment') }
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleClose }> { t('text.cancel') }</Button>
                <Button
                    onClick={ () => handleConfirm('courier') }
                    variant="contained"
                    disabled={ !selectedAddress }
                >
                    { t('text.confirm') }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourierDialog;
