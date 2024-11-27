import { Autocomplete, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { validateEmail, validatePhone, validateRequiredField } from "../../../helpers/validators-helper";
import "./call-back-form.scss";
import { useEffect } from "react";
import InputMask from 'react-input-mask';

interface ICallBackFormProps {
    handleCloseCreatingNewCallback: () => void,
    handleSaveNewCallback: (callback: ICallFormData) => void,
    handleUpdateUnsavedDataExist: (unsavedDataExists: boolean) => void
}

export interface ICallFormData {
    firstName: string,
    secondName: string,
    email: string,
    phoneNumber: string,
    description: string,
    typeOfBid: string
}

export default function CallBackForm({
    handleCloseCreatingNewCallback,
    handleSaveNewCallback,
    handleUpdateUnsavedDataExist
}: ICallBackFormProps) {

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors , submitCount, isValid, isDirty },
    } = useForm<ICallFormData>();

    const { t } = useTranslation();

    const handleCreateNewCallback = (data: ICallFormData) => {
        handleSaveNewCallback(data);
    };

    const handleValidateEmailField = (value: string) => {
        if (value.length === 0) return t("errors.requiredField");
        if (!validateEmail(value)) return t("errors.email");
        return true;
    };
    
    useEffect(() => {
        handleUpdateUnsavedDataExist(isDirty);
    }, [isDirty]);

    return (
        <form className="call-back-form" onSubmit={ handleSubmit(handleCreateNewCallback) }>
            <FormControl>
                <FormLabel className="label">{ t("text.yourName") }</FormLabel>
                <TextField
                    error={ Boolean(errors.firstName) }
                    helperText={ String(errors.firstName?.message || "") }
                    placeholder={ t("text.yourName") }
                    { ...register("firstName", { 
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.yourSecondName") }</FormLabel>
                <TextField
                    error={ Boolean(errors.secondName) }
                    helperText={ String(errors.secondName?.message || "") }
                    placeholder={ t("text.yourSecondName") }
                    { ...register("secondName", { 
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.email") }</FormLabel>
                <TextField
                    error={ Boolean(errors.email) }
                    helperText={ String(errors.email?.message || "") }
                    placeholder={ t("text.email") }
                    { ...register("email", { 
                        validate: (value) => handleValidateEmailField(value)
                    }) }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.typeOfBid") }</FormLabel>
                <Controller
                    name="typeOfBid"
                    control={ control }
                    defaultValue="Отзыв"
                    rules={ { required: t("errors.requiredField") } }
                    render={ ({ field }) => (
                        <Autocomplete
                            { ...field }
                            options={ [
                                "Жалоба", "Отзыв", "Другое"
                            ] }
                            onChange={ (_, value) => field.onChange(value) }
                            renderInput={ (params) => (
                                <TextField
                                    placeholder={ t("text.search") }
                                    { ...params }
                                    error={ Boolean(errors.typeOfBid) }
                                    helperText={ String(errors.typeOfBid?.message || "") }
                                />
                            ) }
                        />
                    ) }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.phoneNumber") }</FormLabel>
                <InputMask
                    { ...register("phoneNumber", {
                        validate: (value) => validatePhone(value) ? true : t("errors.phoneNumber")
                    }) }
                    mask="+7 (999) 999-99-99"
                    maskChar=" "
                    alwaysShowMask={ true }
                >
                { (inputProps: any) => (
                    <TextField
                        error={ Boolean(errors.phoneNumber) }
                        helperText={ String(errors.phoneNumber?.message || "") }
                        { ...inputProps }
                    />
                ) }
                </InputMask>
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.description") }</FormLabel>
                <TextField
                    error={ Boolean(errors.description) }
                    helperText={ String(errors.description?.message || "") }
                    multiline
                    minRows={ 3 }
                    maxRows={ 3 }
                    placeholder={ t("text.description") }
                    { ...register("description", { 
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <div className="form-actions">
                <Button 
                    type="submit" 
                    variant="contained"
                    disabled={ submitCount !== 0 && !isValid }
                >{ t("text.save") }</Button>
                <Button 
                    variant="contained" 
                    onClick={ handleCloseCreatingNewCallback }
                >{ t("text.close") }</Button>
            </div>
        </form>
    );
}