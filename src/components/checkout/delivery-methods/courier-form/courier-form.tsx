import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IAddress } from "../../../../interfaces/interfaces.ts";
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from 'react-dadata';
import {getFormatAddressStringForSelect, getFormattedAddressString} from "../../../../helpers/cart-helpers.tsx";
import 'react-dadata/dist/react-dadata.css';
import './courier-form.scss';
import IconButton from "@mui/material/IconButton";
import { FaTimes } from 'react-icons/fa';
import CustomModal from "../../../../components-ui/custom-modal/custom-modal.tsx";
import _ from 'lodash';

interface CourierDialogProps {
    currentAddress: IAddress | null;
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

const CourierForm: FC<CourierDialogProps> = ({
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
    const [addressIdToDelete, setAddressIdToDelete] = useState<string>('');
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
            setAddresses((prevAddresses: IAddress[]) => [ newAddress, ...prevAddresses ]);
        }

        handleConfirm('courier');
    };

    const [open, setOpen] = useState(false);

    return (
                <form className="courier-dialog-wrapper" onSubmit={ onSubmit }>
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
                      renderValue={ () => `${ getFormatAddressStringForSelect(currentAddress, t)}...` }
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
                                            setOpen(true);
                                            address.id && setAddressIdToDelete(address.id);
                                        } }
                                        size="small"
                                    >
                                        <FaTimes size={ 20 } />
                                    </IconButton>

                                    <CustomModal
                                        title={ `${ t('text.checkout.deleteAddress') }?` }
                                        isDisplay={ open }
                                        typeOfActions='default'
                                        actionConfirmed={ () => {
                                            handleDeleteAddress(addressIdToDelete);
                                            setOpen(false);
                                        } }
                                        closeModal={ () => setOpen(false) }
                                    >
                                        <></>
                                    </CustomModal>
                                </div>
                            </MenuItem>
                        )) }
                    </Select>
                  </FormControl>
                }

                    <Typography variant="subtitle1">{ t('text.checkout.deliveryAddress') }</Typography>
                    <Stack className="dialog-content" spacing={ 2 }>

                        <div className="address-suggestion-wrapper">
                            <AddressSuggestions
                                token={ DA_DATA_API_KEY }
                                defaultQuery={ currentAddress?.address }
                                value={ { value: currentAddress?.address } }
                                inputProps={ {
                                    placeholder: t('text.checkout.courierFormLabels.address'),
                                    onChange: handleChange('address'),
                                    className:  !!currentAddress?.address ? `da-data-field` : `da-data-field error`,
                                } }
                                onChange={ setDaDataFieldValue }
                            />
                            {!currentAddress?.address && (
                                <Typography className="error-text" variant="caption">
                                    {t('text.requiredField')}
                                </Typography>
                            )}
                        </div>

                        <Stack className="stack-wrapper" direction="row" spacing={ 2 }>
                            <TextField
                                size="small"
                                label={ t('text.checkout.courierFormLabels.houseNumber') }
                                variant="outlined"
                                value={ currentAddress?.houseNumber || '' }
                                onChange={ handleChange('houseNumber') }
                                fullWidth
                            />
                            <TextField
                                label={ t('text.checkout.courierFormLabels.entrance') }
                                variant="outlined"
                                size="small"
                                value={ currentAddress?.entrance || '' }
                                onChange={ handleChange('entrance') }
                                fullWidth
                            />
                            <TextField
                                label={ t('text.checkout.courierFormLabels.apartment') }
                                variant="outlined"
                                size="small"
                                value={ currentAddress?.apartment || '' }
                                onChange={ handleChange('apartment') }
                                fullWidth
                            />
                        </Stack>
                        <Stack direction="row" spacing={ 2 }>
                            <TextField
                                size="small"
                                label={ t('text.checkout.courierFormLabels.floor') }
                                variant="outlined"
                                value={ currentAddress?.floor || '' }
                                onChange={ handleChange('floor') }
                                fullWidth
                            />
                            <TextField
                                size="small"
                                fullWidth
                                label={ t('text.checkout.courierFormLabels.intercom') }
                                variant="outlined"
                                value={ currentAddress?.intercom || '' }
                                onChange={ handleChange('intercom') }
                            />
                        </Stack>
                        <TextField
                            size="small"
                            label={ t('text.checkout.courierFormLabels.comment') }
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={ 4 }
                            value={ currentAddress?.comment || '' }
                            onChange={ handleChange('comment') }
                        />
                    </Stack>
                <div className="buttons-wrapper">
                    <Button
                        onClick={ handleClose }
                    >
                        { t('text.cancel') }
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!currentAddress?.address}
                        type="submit"
                    >
                        { t('text.confirm') }
                    </Button>
                </div>
                </form>
    );
};

export default CourierForm;
