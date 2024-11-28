import {
    Button,
    FormControl, FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IAddress } from "../../../../interfaces/interfaces.ts";
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from 'react-dadata';
import { getFormatAddressStringForSelect, getFormattedAddressString } from "../../../../helpers/cart-helpers.tsx";
import 'react-dadata/dist/react-dadata.css';
import './courier-form.scss';
import IconButton from "@mui/material/IconButton";
import { FaTimes } from 'react-icons/fa';
import CustomModal from "../../../../components-ui/custom-modal/custom-modal.tsx";
import _ from 'lodash';

import { useForm, Controller, useWatch } from 'react-hook-form';

interface CourierDialogProps {
    currentAddress: IAddress | null;
    handleClose: () => void;
    handleSaveDeliveryAddressData: (data: string) => void;
    addresses: IAddress[];
    currentAddressId: number;
    setCurrentAddressId: (id: number) => void;
    handleDeleteAddress: (id: number) => void;
    setCurrentAddress: (e: IAddress) => void;
    setAddresses: (addresses: any) => void;
}

const CourierForm: FC<CourierDialogProps> = ({
     handleClose,
     addresses,
     setAddresses,
     handleSaveDeliveryAddressData,
     currentAddress,
     setCurrentAddress,
     currentAddressId,
     setCurrentAddressId,
     handleDeleteAddress,
}) => {
    const { t } = useTranslation();
    const [prevSelectedAddress, setPrevSelectedAddress] = useState<IAddress | null>(currentAddress);
    const [addressIdToDelete, setAddressIdToDelete] = useState<number | null>(null);
    const [daDataFieldValue, setDaDataFieldValue] = useState<DaDataSuggestion<DaDataAddress> | undefined>();
    const [deleteAddressModalIsOpen, setDeleteAddressModalIsOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitted },
        setValue,
        setError,
        clearErrors,
    } = useForm<IAddress>({
        defaultValues: currentAddress || {},
    });

    useEffect(() => {
        if (daDataFieldValue?.value) {
            setCurrentAddress((prev: IAddress) => ({ ...prev, address: daDataFieldValue.value }));
            setValue('address', daDataFieldValue.value);
        }
    }, [daDataFieldValue?.value, setValue]);

    const handleSelectAddressChange = (event: ChangeEvent<{ value: unknown }>) => {
        const selectedAddressId = event.target.value as number;
        const newSelectedAddress = addresses
            .find(({ id }) => id === selectedAddressId);

        if (newSelectedAddress) {
            Object.keys(newSelectedAddress).forEach(key => {
                setValue(key as keyof typeof newSelectedAddress, newSelectedAddress[key as keyof typeof newSelectedAddress]);
            });
            setPrevSelectedAddress(newSelectedAddress);
            setCurrentAddress(newSelectedAddress);
            setCurrentAddressId(selectedAddressId);
        }
    };

    const onSubmit = (data: IAddress) => {
        const filterEmptyEntries = (obj: Record<string, any>) =>
            Object.entries(obj).filter(([, value]) => value);

        const filteredCurrentAddressEntries = filterEmptyEntries(data);
        const filteredPrevSelectedAddressEntries = filterEmptyEntries(prevSelectedAddress || {});

        if (!_.isEqual(filteredCurrentAddressEntries, filteredPrevSelectedAddressEntries)) {
            const newId = Number(_.uniqueId('1'));
            const newAddress: IAddress = { ...data, id: newId };

            setCurrentAddressId(newId);
            setCurrentAddress(newAddress);
            setAddresses((prevAddresses: IAddress[]) => [newAddress, ...prevAddresses]);
        }
        handleSaveDeliveryAddressData('courier');
    };

    const addressValue = useWatch({ control, name: 'address' });

    useEffect(() => {
        if (!addressValue && isSubmitted) {
            setError('address', {
                type: 'manual',
                message: t('errors.requiredField'),
            });
        } else {
            clearErrors('address');
        }
    }, [addressValue, setError, clearErrors]);


    return (
        <form className="courier-form-wrapper" onSubmit={ handleSubmit(onSubmit) }>
            { addresses.length > 0 &&
              <FormControl className="form-control" variant="outlined">
                <InputLabel>{ t('text.checkout.selectAddress') }</InputLabel>
                <Select
                  onChange={ handleSelectAddressChange }
                  MenuProps={ {
                      classes: {
                          paper: "custom-select-menu",
                      },
                  } }
                  label={ t('text.checkout.selectAddress') }
                  value={ currentAddress?.id || '' }
                  renderValue={ () => `${ getFormatAddressStringForSelect(currentAddress, t)}...` }
                >
                    { addresses.map((address, index) => (
                        <MenuItem
                            key={ index }
                            value={ address?.id || '' }
                        >
                            <div className="address-wrapper">
                                <Stack direction="column">
                                    { getFormattedAddressString(address, t) }
                                </Stack>
                                <IconButton
                                    className={ `delete-icon ${ address.id === currentAddressId ? 'hidden' : 'visible'}` }
                                    onClick={ (e) => {
                                        e.stopPropagation();
                                        setDeleteAddressModalIsOpen(true);
                                        address.id && setAddressIdToDelete(address.id);
                                    } }
                                    size="small"
                                >
                                    <FaTimes size={ 20 } />
                                </IconButton>

                                <CustomModal
                                    title={ `${ t('text.checkout.deleteAddress') }?` }
                                    isDisplay={ deleteAddressModalIsOpen }
                                    typeOfActions="default"
                                    actionConfirmed={ () => {
                                        addressIdToDelete && handleDeleteAddress(addressIdToDelete);
                                        setDeleteAddressModalIsOpen(false);
                                    } }
                                    closeModal={ () => setDeleteAddressModalIsOpen(false) }
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
                    <Controller
                        name="address"
                        control={ control }
                        rules={ { required: t('errors.requiredField') } }
                        render={ ({ field }) => (
                            <FormControl fullWidth error={ !!errors.address }>
                                <AddressSuggestions
                                    token={ import.meta.env.VITE_APP_DA_DATA_API_KEY }
                                    defaultQuery={ currentAddress?.address }
                                    value={ { value: field.value } }
                                    suggestionsClassName='da-data-suggestions'
                                    suggestionClassName='da-data-suggestion'
                                    inputProps={ {
                                        ...field,
                                        placeholder: t('text.checkout.courierFormLabels.address'),
                                        className: !field.value && isSubmitted ? `da-data-field error` : `da-data-field`,
                                    } }
                                    onChange={ (value) => {
                                        field.onChange(value);
                                        setDaDataFieldValue(value);
                                    } }
                                />
                                { errors.address && (
                                    <FormHelperText className="error-text">{ errors.address.message }</FormHelperText>
                                ) }
                            </FormControl>
                        ) }
                    />
                </div>

                <Stack className="stack-wrapper" direction="row" spacing={ 2 }>
                    <Controller
                        name="houseNumber"
                        control={ control }
                        render={ ({ field }) => (
                            <TextField
                                size="small"
                                label={ t('text.checkout.courierFormLabels.houseNumber') }
                                variant="outlined"
                                { ...field }
                                fullWidth
                            />
                        ) }
                    />
                    <Controller
                        name="entrance"
                        control={ control }
                        render={ ({ field }) => (
                            <TextField
                                size="small"
                                label={ t('text.checkout.courierFormLabels.entrance') }
                                variant="outlined"
                                { ...field }
                                fullWidth
                            />
                        ) }
                    />
                    <Controller
                        name="apartment"
                        control={ control }
                        render={ ({ field }) => (
                            <TextField
                                size="small"
                                label={ t('text.checkout.courierFormLabels.apartment') }
                                variant="outlined"
                                { ...field }
                                fullWidth
                            />
                        ) }
                    />
                </Stack>

                <Stack direction="row" spacing={ 2 }>
                    <Controller
                        name="floor"
                        control={ control }
                        render={ ({ field }) => (
                            <TextField
                                size="small"
                                label={ t('text.checkout.courierFormLabels.floor') }
                                variant="outlined"
                                { ...field }
                                fullWidth
                            />
                        ) }
                    />
                    <Controller
                        name="intercom"
                        control={ control }
                        render={ ({ field }) => (
                            <TextField
                                size="small"
                                label={ t('text.checkout.courierFormLabels.intercom') }
                                variant="outlined"
                                { ...field }
                                fullWidth
                            />
                        ) }
                    />
                </Stack>

                <Controller
                    name="comment"
                    control={ control }
                    render={ ({ field }) => (
                        <TextField
                            size="small"
                            label={ t('text.checkout.courierFormLabels.comment') }
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={ 4 }
                            { ...field }
                        />
                    ) }
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
                    type="submit"
                >
                    { t('text.confirm') }
                </Button>
            </div>
        </form>
    );
};

export default CourierForm;
