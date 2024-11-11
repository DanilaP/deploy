import TextField from "@mui/material/TextField";
import { IProvider } from "../../../../interfaces/interfaces";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./providersManageForm.scss";
import { Button, Checkbox } from "@mui/material";
import { validateProviderForm } from "../validators";

interface IProvidersManageFormProps {
    choosedProvider: IProvider,
    handleCancelManaging: () => void
    handleOnUpdateProvider: (newProviderData: IProvider) => void,
    handleOnCreateProvider: (newProviderData: IProvider) => void
}

export default function ProvidersManageForm({
    choosedProvider,
    handleCancelManaging,
    handleOnUpdateProvider,
    handleOnCreateProvider
}: IProvidersManageFormProps) {

    const isEdit = choosedProvider.id ? "edit" : "create";

    const [newProviderData, setNewProviderData] = useState<IProvider>(choosedProvider);
    const { t } = useTranslation();

    const validationFormData = validateProviderForm(newProviderData);
    
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
                        onChange={ (e) => setNewProviderData(
                            { ...newProviderData, contactPerson: { ...newProviderData.contactPerson, name: e.target.value } }
                        ) }
                        placeholder={ t("text.name") }
                        defaultValue={ isEdit ? choosedProvider.contactPerson.name : "" }
                    />
                    <TextField
                        onChange={ (e) => setNewProviderData(
                            { ...newProviderData, contactPerson: { ...newProviderData.contactPerson, phoneNumber: e.target.value } }
                        ) }
                        placeholder={ t("text.phoneNumber") }
                        defaultValue={ isEdit ? choosedProvider.contactPerson.phoneNumber : "" }
                    />
                    <TextField
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
                    onClick={ newProviderData.id
                        ? () => handleOnUpdateProvider(newProviderData) 
                        : () => handleOnCreateProvider(newProviderData)
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