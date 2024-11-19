import { Controller, useForm } from "react-hook-form";
import { DEFAULT_CATEGORY_FORM } from "../constants";
import { ICategory } from "../../../../interfaces/interfaces";
import { Button, TextField, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { validateRequiredField } from "../../../../helpers/validators-helper";
import "./CategoryManageForm.scss";
import { useEffect } from "react";
import InputFile from "../../../../components-ui/custom-file-nput/file-input";
import { convertFileListToBlobArray } from "../../../../helpers/convert-file-list-to-blob-array";

interface ICategoryManageFormProps {
    currentCategory: ICategory | null,
    mode: "edit" | "create" | "",
    handleApproveAddingCategory: (formData: ICategoryForm) => void
    handleCancelAddingCategory: () => void,
    handleUpdateUnsavedData: (status: boolean) => void
}

export interface ICategoryForm {
    title: string,
    image: string,
    description: string,
    id?: string
}

export default function CategoryManageForm(props: ICategoryManageFormProps) {

    const { t } = useTranslation();
    const { 
        handleSubmit, 
        register,
        watch,
        control,
        formState: { errors, isValid, submitCount, isDirty }
    } = useForm<ICategoryForm>({
        defaultValues: props.currentCategory && props.mode === "edit"
            ? props.currentCategory
            : DEFAULT_CATEGORY_FORM
    });

    const handleUpdateGoodData = (formData: ICategoryForm) => {
       props.handleApproveAddingCategory(formData);
    };

    useEffect(() => {
        props.handleUpdateUnsavedData(isDirty);
    }, [isDirty]);

    return (
        <form className="category-form" onSubmit={ handleSubmit(handleUpdateGoodData) }>
            <div className="field">
                <label 
                    className="label"
                    htmlFor="update-category-title"
                >{ t("text.name") }</label>
                <TextField
                    error={ Boolean(errors.title) }
                    helperText={ String(errors.title?.message || "") }
                    id="update-category-title"
                    placeholder={ t("text.name") }
                    { ...register("title", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </div>
            <div className="field">
                <label 
                    className="label"
                    htmlFor="update-category-description"
                >{ t("text.description") }</label>
                <TextField
                    error={ Boolean(errors.description) }
                    helperText={ String(errors.description?.message || "") }
                    id="update-category-descrition"
                    placeholder={ t("text.description") }
                    { ...register("description", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </div>
            <div className="field">
                <div className="field-row-label">
                    <label className="label">{ t("text.images") }</label>
                    <Controller
                        name="image"
                        control={ control }
                        rules={ { required: t("errors.requiredField") } }
                        render={ ({ field }) => (
                            <InputFile
                                { ...field }
                                width="25px"
                                height="25px"
                                accept=".png, .jpeg, .jpg"
                                onChange={ (e) => {
                                    const files = e.target.files;
                                    const blobArray = convertFileListToBlobArray(files);
                                    field.onChange(blobArray);
                                } }
                            />
                        ) }
                    />
                </div>
                <span className="field-error-text">{ String(errors.image?.message || "") }</span>
                <div className="additions">
                    {
                        (watch("image")?.length !== 0)
                        ? <Tooltip
                            key={ watch("image") }
                            title={
                                <img
                                    width="300px"
                                    height="200px"
                                    src={ watch("image") }
                                />
                            }
                            placement="top"
                        >
                            <a href={ watch("image") } target="__blank">
                                <img 
                                    className="image" 
                                    src={ watch("image") }
                                />
                            </a>
                        </Tooltip>
                        : null
                    }
                </div>
            </div>
            <div className="form-actions">
                <Button 
                    type="submit"
                    disabled={ submitCount !== 0 && !isValid }
                    variant="contained"
                >{ t("text.save") }</Button>
                <Button 
                    type="submit"
                    onClick={ props.handleCancelAddingCategory }
                    variant="contained"
                >{ t("text.cancel") }</Button>
            </div>
        </form>
    );
}