import TextField from "@mui/material/TextField";
import { IProvider } from "../../../../interfaces/interfaces";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import InputMask from 'react-input-mask';
import { validateEmail, validatePhone, validateRequiredField, validateWebsiteRef } from "../../../../helpers/validators-helper";
import "./providersManageForm.scss";

interface IProvidersManageFormProps {
    choosedProvider: IProvider,
    handleCancelManaging: () => void
    handleOnUpdateProvider: (newProviderData: IProvider) => void,
    handleOnCreateProvider: (newProviderData: IProvider) => void,
    handleSetUnsavedChangesExist: (status: boolean) => void,
}

export default function ProvidersManageForm({
    choosedProvider,
    handleCancelManaging,
    handleOnUpdateProvider,
    handleOnCreateProvider,
    handleSetUnsavedChangesExist,
}: IProvidersManageFormProps) {

    const isEdit = Boolean(choosedProvider.id);
    const { t } = useTranslation();

    const { 
        handleSubmit, 
        register,
        control,
        formState: { errors, isValid, submitCount, isDirty }
    } = useForm<IProvider>({ defaultValues: {
        ...choosedProvider,
        active: isEdit ? choosedProvider.active : true
    } });
    
    const handleUpdateProvider = (data: IProvider) => {
        if (isEdit) {
            handleOnUpdateProvider(data);
        } else {
            handleOnCreateProvider(data);
        }
    };

    const handleValidateEmailField = (value: string) => {
        if (value.length === 0) return true;
        if (!validateEmail(value)) return "errors.email";
        return true;
    };

    const handleValidateWebsiteField = (value: string) => {
        if (value.length === 0) return true;
        if (!validateWebsiteRef(value)) return t("errors.website");
        return true;
    };
    
    useEffect(() => {
        handleSetUnsavedChangesExist(isDirty);
    }, [isDirty]);
    
    return (
        <form onSubmit={ handleSubmit(handleUpdateProvider) }>
            <div className="providers-manage-form">
                <div className="field">
                    <label
                        className="label"
                        htmlFor="update-provider-name"
                    >
                        { t("text.name") }
                    </label>
                    <TextField
                        error={ Boolean(errors.name) }
                        helperText={ String(errors.name?.message || "") }
                        { ...register("name", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        id="update-provider-name"
                        placeholder={ t("text.name") }
                    />
                </div>
                <div className="field">
                    <label 
                        htmlFor="update-provider-email"
                        className="label"
                    >
                        { t("text.email") }
                    </label>
                    <TextField
                        error={ Boolean(errors.email) }
                        helperText={ String(errors.email?.message || "") }
                        { ...register("email", {
                            validate: (value) => {
                                const validationData = handleValidateEmailField(value);
                                return validationData === true ? true : t(validationData);
                            }
                        }) }
                        placeholder={ t("text.email") }
                        id="update-provider-email"
                    />
                </div>
                <div className="field">
                    <label
                        className="label"
                        htmlFor="update-provider-description"
                    >
                        { t("text.description") }
                    </label>
                    <TextField
                        error={ Boolean(errors.description) }
                        helperText={ String(errors.description?.message || "") }
                        { ...register("description", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        multiline
                        minRows={ 2 }
                        maxRows={ 2 }
                        id="update-provider-description"
                        placeholder={ t("text.description") }
                    />
                </div>
                <div className="field">
                    <label
                        className="label"
                        htmlFor="update-provider-website"
                    >
                        { t("text.website") }
                    </label>
                    <TextField
                        error={ Boolean(errors.website) }
                        helperText={ String(errors.website?.message || "") }
                        { ...register("website", {
                            validate: (value) => handleValidateWebsiteField(value)
                        }) }
                        id="update-provider-website"
                        placeholder={ t("text.website") }
                    />
                </div>
                <div className="field">
                    <label
                        className="label"
                        htmlFor="update-provider-ogrn"
                    >
                        { t("text.ogrn") }
                    </label>
                    <TextField
                        error={ Boolean(errors.ogrn) }
                        helperText={ String(errors.ogrn?.message || "") }
                        { ...register("ogrn", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        id="update-provider-ogrn"
                        placeholder={ t("text.ogrn") }
                    />
                </div>
                <div className="field">
                    <label
                        className="label"
                        htmlFor="update-provider-inn"
                    >
                        { t("text.inn") }
                    </label>
                    <TextField
                        error={ Boolean(errors.inn) }
                        helperText={ String(errors.inn?.message || "") }
                        { ...register("inn", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        id="update-provider-inn"
                        placeholder={ t("text.inn") }
                    />
                </div>
                <div className="field-with-checkbox">
                    <label
                        className="label"
                        htmlFor="update-provider-active"
                    >
                        { t("text.isActive") }
                    </label>
                    <Controller
                        name="active"
                        control={ control }
                        render={ ({ field }) => (
                            <Checkbox
                                { ...field }
                                checked={ field.value }
                                onChange={ (e) => field.onChange(e.target.checked) }
                                className="checkbox"
                                id="update-provider-active"
                            />
                        ) }
                    />  
                </div>
                <div className="field-column">
                    <label className="label">
                        { t("text.contactPersonLabel") }
                    </label>
                    <div className="fields-data">
                        <TextField
                            className="field-input-contact-person"
                            error={ Boolean(errors.contactPerson?.name) }
                            helperText={ String(errors.contactPerson?.name?.message || "") }
                            { ...register("contactPerson.name", {
                                validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                            }) }
                            placeholder={ t("text.name") }
                        />
                        <Controller
                            name="contactPerson.phoneNumber"
                            control={ control }
                            rules={ {
                                required: t("errors.requiredField"),
                                validate: (value) => validatePhone(value) ? true : t("errors.phone")
                            } }
                            render={ ({ field }) => (
                                <InputMask
                                    { ...field }
                                    mask="+7 (999) 999-99-99"
                                    maskChar=" "
                                    alwaysShowMask={ true }
                                >
                                { (inputProps: any) => (
                                    <TextField
                                        error={ Boolean(errors.contactPerson?.phoneNumber) }
                                        helperText={ String(errors.contactPerson?.phoneNumber?.message || "") }
                                        { ...inputProps }
                                    />
                                ) }
                                </InputMask>
                            ) }
                        />
                        { /*<TextField
                            className="field-input-contact-person"
                            error={ Boolean(errors.contactPerson?.phoneNumber) }
                            helperText={ String(errors.contactPerson?.phoneNumber?.message || "") }
                            { ...register("contactPerson.phoneNumber", {
                                validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                            }) }
                            placeholder={ t("text.phoneNumber") }
                        />*/ }
                        <TextField
                            className="field-input-contact-person"
                            error={ Boolean(errors.contactPerson?.post) }
                            helperText={ String(errors.contactPerson?.post?.message || "") }
                            defaultValue={ "" }
                            { ...register("contactPerson.post") }
                            placeholder={ t("text.post") }
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <Button
                        disabled={ !isValid && submitCount !== 0 }
                        type="submit"
                        variant="contained"
                    >
                        { t("text.save") }
                    </Button>
                    <Button
                        onClick={ handleCancelManaging } 
                        variant="contained"
                    >
                        { t("text.cancel") }
                    </Button>
                </div>
            </div>
        </form>
    );
}