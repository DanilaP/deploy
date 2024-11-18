import TextField from "@mui/material/TextField";
import { IProvider } from "../../../../interfaces/interfaces";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { validateEmail, validateRequiredField } from "../../../../helpers/validators-helper";
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
        active: choosedProvider.active
    } });
    
    const handleUpdateProvider = (data: IProvider) => {
        if (isEdit) {
            handleOnUpdateProvider(data);
        } else {
            handleOnCreateProvider(data);
        }
    };

    const handleValidateEmailField = (value: string) => {
        if (!validateRequiredField(value)) return "errors.requiredField";
        if (!validateEmail(value)) return "errors.email";
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
                        id="update-provider-email"
                    />
                </div>
                <div className="field">
                    <label 
                        htmlFor="update-provider-dateOfCreation"
                        className="label"
                    >
                        { t("text.dateOfCreation") }
                    </label>
                    <TextField
                        error={ Boolean(errors.dateOfCreation) }
                        helperText={ String(errors.dateOfCreation?.message || "") }
                        { ...register("dateOfCreation", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        type="date"
                        id="update-provider-dateOfCreation"
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
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        id="update-provider-website"
                        placeholder={ t("text.website") }
                    />
                </div>
                <div className="field">
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
                        <TextField
                            className="field-input-contact-person"
                            error={ Boolean(errors.contactPerson?.phoneNumber) }
                            helperText={ String(errors.contactPerson?.phoneNumber?.message || "") }
                            { ...register("contactPerson.phoneNumber", {
                                validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                            }) }
                            placeholder={ t("text.phoneNumber") }
                        />
                        <TextField
                            className="field-input-contact-person"
                            error={ Boolean(errors.contactPerson?.post) }
                            helperText={ String(errors.contactPerson?.post?.message || "") }
                            { ...register("contactPerson.post", {
                                validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                            }) }
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