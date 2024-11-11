import TextField from "@mui/material/TextField";
import { IProvider } from "../../../../interfaces/interfaces";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox } from "@mui/material";
import { validateProviderForm } from "../validators";
import lodash from "lodash";
import "./providersManageForm.scss";

interface IProvidersManageFormProps {
    choosedProvider: IProvider,
    isFormTouched: boolean,
    handleCancelManaging: () => void
    handleOnUpdateProvider: (formValid: boolean, newProviderData: IProvider) => void,
    handleOnCreateProvider: (formValid: boolean, newProviderData: IProvider) => void,
    handleSetUnsavedChangesExist: (status: boolean) => void,
}

export default function ProvidersManageForm({
    choosedProvider,
    isFormTouched,
    handleCancelManaging,
    handleOnUpdateProvider,
    handleOnCreateProvider,
    handleSetUnsavedChangesExist,
}: IProvidersManageFormProps) {

    const isEdit = choosedProvider.id ? "edit" : "create";

    const [newProviderData, setNewProviderData] = useState<IProvider>(choosedProvider);
    const { t } = useTranslation();

    const validationFormData = validateProviderForm(newProviderData);


    useEffect(() => {
        handleSetUnsavedChangesExist(!lodash.isEqual(newProviderData, choosedProvider));
    }, [newProviderData, choosedProvider]);

    return (
        <div className="providers-manage-form">
            <div className="field">
                <label
                    className="label"
                    htmlFor="update-provider-name"
                >
                    { t("text.name") }
                </label>
                <TextField
                    error={ validationFormData?.name && isFormTouched }
                    helperText={ validationFormData?.name && isFormTouched && t(validationFormData.name?.error) || "" }
                    onChange={ (e) => setNewProviderData({ ...newProviderData, name: e.target.value }) }
                    id="update-provider-name"
                    placeholder={ t("text.name") }
                    defaultValue={ isEdit ? choosedProvider?.name : "" }
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
                    error={ validationFormData?.dateOfCreation && isFormTouched }
                    helperText={ 
                        validationFormData?.dateOfCreation && 
                        isFormTouched && 
                        t(validationFormData.dateOfCreation?.error) || "" 
                    }
                    type="date"
                    onChange={ (e) => setNewProviderData({ ...newProviderData, dateOfCreation: e.target.value }) }
                    id="update-provider-dateOfCreation"
                    defaultValue={ isEdit ? choosedProvider?.dateOfCreation : "" }
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
                    error={ validationFormData?.description && isFormTouched }
                    helperText={ 
                        validationFormData?.description && 
                        isFormTouched && 
                        t(validationFormData.description?.error) || "" 
                    }
                    multiline
                    minRows={ 3 }
                    maxRows={ 3 }
                    onChange={ (e) => setNewProviderData({ ...newProviderData, description: e.target.value }) }
                    id="update-provider-description"
                    placeholder={ t("text.description") }
                    defaultValue={ isEdit ? choosedProvider?.description : "" }
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
                    error={ validationFormData?.website && isFormTouched }
                    helperText={ 
                        validationFormData?.website && 
                        isFormTouched && 
                        t(validationFormData.website?.error) || "" 
                    }
                    onChange={ (e) => setNewProviderData({ ...newProviderData, website: e.target.value }) }
                    id="update-provider-website"
                    placeholder={ t("text.website") }
                    defaultValue={ isEdit ? choosedProvider?.website : "" }
                />
            </div>
            <div className="field">
                <label
                    className="label"
                    htmlFor="update-provider-website"
                >
                    { t("text.isActive") }
                </label>
                <Checkbox
                    onChange={ (e) => setNewProviderData({ ...newProviderData, active: e.target.checked }) }
                    className="checkbox"
                    id="update-provider-active"
                    defaultChecked={ isEdit ? choosedProvider?.active : false }
                />
            </div>
            <div className="field-column">
                <label
                    className="label"
                    htmlFor="update-provider-contactPerson"
                >
                    { t("text.contactPersonLabel") }
                </label>
                <div className="fields-data">
                    <TextField
                        error={ validationFormData?.contactPerson?.name && isFormTouched }
                        helperText={ 
                            validationFormData?.contactPerson?.name && 
                            isFormTouched && 
                            t(validationFormData?.contactPerson?.name?.error) || "" 
                        }
                        onChange={ (e) => setNewProviderData(
                            { ...newProviderData, contactPerson: { ...newProviderData.contactPerson, name: e.target.value } }
                        ) }
                        placeholder={ t("text.name") }
                        defaultValue={ isEdit ? choosedProvider.contactPerson.name : "" }
                    />
                    <TextField
                        error={ validationFormData?.contactPerson?.phoneNumber && isFormTouched }
                        helperText={ 
                            validationFormData?.contactPerson?.phoneNumber && 
                            isFormTouched && 
                            t(validationFormData?.contactPerson?.phoneNumber?.error) || "" 
                        }
                        onChange={ (e) => setNewProviderData(
                            { ...newProviderData, contactPerson: { ...newProviderData.contactPerson, phoneNumber: e.target.value } }
                        ) }
                        placeholder={ t("text.phoneNumber") }
                        defaultValue={ isEdit ? choosedProvider.contactPerson.phoneNumber : "" }
                    />
                    <TextField
                        error={ validationFormData?.contactPerson?.post && isFormTouched }
                        helperText={ 
                            validationFormData?.contactPerson?.post && 
                            isFormTouched && 
                            t(validationFormData?.contactPerson.post?.error) || "" 
                        }
                        onChange={ (e) => setNewProviderData(
                            { ...newProviderData, contactPerson: { ...newProviderData.contactPerson, post: e.target.value } }
                        ) }
                        placeholder={ t("text.post") }
                        defaultValue={ isEdit ? choosedProvider.contactPerson.post : "" }
                    />
                </div>
            </div>
            <div className="form-actions">
                <Button
                    disabled={ !validationFormData.formValid && isFormTouched }
                    onClick={ newProviderData.id
                        ? () => handleOnUpdateProvider(validationFormData.formValid, newProviderData) 
                        : () => handleOnCreateProvider(validationFormData.formValid, newProviderData)
                    }
                    variant="contained"
                >
                    { t("text.confirm") }
                </Button>
                <Button
                    onClick={ handleCancelManaging } 
                    variant="contained"
                >
                    { t("text.close") }
                </Button>
            </div>
        </div>
    );
}