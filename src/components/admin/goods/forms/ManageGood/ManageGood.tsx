import { Button, Autocomplete, TextField, Tooltip } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { DEFAULT_PRODUCT } from "./constants";
import { useTranslation } from "react-i18next";
import { IAdditionalInfo, IProduct, ISelect, IVariation } from "../../../../../interfaces/interfaces";
import { BiMessageSquareAdd } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useForm, Controller, useFieldArray, FieldArrayWithId } from "react-hook-form";
import { validateRequiredField } from "./validators";
import IconButton from "@mui/material/IconButton";
import InputFile from "../../../../../components-ui/custom-file-nput/file-input";
import "./ManageGood.scss";
import { useCategoryHelper } from "../../../../../helpers/use-category-helper";
import { convertFileListToBlobArray } from "../../../../../helpers/convert-file-list-to-blob-array";

interface IProductForm {
    additionalInfo: IAdditionalInfo[],
    category: ISelect[],
    description: string,
    fullDescription: string,
    images: string[],
    video: string,
    name: string,
    partNumber: string,
    provider: string,
    variations: IVariation[],
}

export const ManageGoodForm = ({ 
    mode,
    goodData,
    handleCancelUpdating,
    handleUpdateGood,
    handleUnsavedDataExist
}: {
    mode: "edit" | "create" | null,
    goodData?: IProduct | null,
    handleUpdateGood: (goodData: IProduct) => void,
    handleCancelUpdating: () => void,
    handleUnsavedDataExist: (status: boolean) => void
}) => {
    
    const { t } = useTranslation();
    const [goodDataForForm, setGoodDataForForm] = useState<IProduct>(goodData || DEFAULT_PRODUCT);
    const { categoriesForSelect } = useCategoryHelper();
    const isEdit = mode === "edit";

    const { 
        handleSubmit, 
        reset, 
        watch, 
        register,
        control, 
        formState: { errors, isValid, submitCount, isDirty } 
    } = useForm<IProductForm>();

    const { 
        fields: additionalInfoFields, 
        append: appendAdditionalInfo, 
        remove: removeAdditionalInfo 
    } = useFieldArray({
        control,
        name: "additionalInfo",
    });

    const { 
        fields: variationsInfoFields,
        append: appendVariation, 
        remove: removeVariation, 
    } = useFieldArray({
        control,
        name: "variations",
    });

    const handleUpdateGoodData = (data: IProductForm) => {
        const goodDataForSend: IProduct = {
            ...data,
            category: data.category.map((el: ISelect) => el.id)
        };
        if (isEdit) {
            handleUpdateGood({ ...goodDataForSend, id: goodData?.id });
        } else {
            handleUpdateGood(goodDataForSend);
        }
    };

    const handleAddVariation = () => {
        appendVariation({ name: "", title: "", stock: 1, price: 1, images: [""], video: "-" });
    };
    
    const handleDeleteVariation = (index: number) => {
        if (watch('variations')?.length === 1) return;
        removeVariation(index);
    };

    const handleAddAdditionalInfo = () => {
        appendAdditionalInfo({ id: Date.now(), name: '', description: '' });
    };
    
    const handleDeleteAdditionalData = (index: number) => {
        if (watch('additionalInfo')?.length === 1) return;
        removeAdditionalInfo(index);
    };

    useEffect(() => {
        if (goodData) {
            setGoodDataForForm(goodData);
        }
    }, [goodData]);

    useEffect(() => {
        handleUnsavedDataExist(isDirty);
    }, [isDirty]);

    useEffect(() => {
        reset(prev => {
            return { 
                ...prev,
                additionalInfo: goodDataForForm.additionalInfo,
                variations: goodDataForForm.variations
            };
        });
    }, [goodDataForForm]);
    
    if (categoriesForSelect?.length === 0) return <div className="loading">Loading...</div>;
    return (
        <form onSubmit={ handleSubmit(handleUpdateGoodData) }>
            <div className="update-good-form">
                <div className="field">
                    <label 
                        className="label"
                        htmlFor="update-good-partNumber"
                    >{ t("text.partNumber") }</label>
                    <TextField
                        error={ Boolean(errors.partNumber) }
                        helperText={ String(errors.partNumber?.message || "") }
                        defaultValue={ isEdit ? goodDataForForm.partNumber : "" }
                        id="update-good-partNumber"
                        placeholder={ t("text.partNumber") }
                        { ...register("partNumber", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                    />
                </div>
                <div className="field">
                    <label 
                        className="label"
                        htmlFor="update-good-name"
                    >{ t("text.name") }</label>
                    <TextField
                        error={ Boolean(errors.name) }
                        helperText={ String(errors.name?.message || "") }
                        defaultValue={ isEdit ? goodDataForForm.name : "" }
                        id="update-good-name"
                        placeholder={ t("text.name") }
                        { ...register("name", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                    />
                </div>
                <div className="field">
                    <label 
                        className="label"
                        htmlFor="update-good-provider"
                    >{ t("text.provider") }</label>
                    <TextField
                        error={ Boolean(errors.provider) }
                        helperText={ String(errors.provider?.message || "") }
                        defaultValue={ isEdit ? goodDataForForm.provider : "" }
                        id="update-good-provider"
                        placeholder={ t("text.provider") }
                        { ...register("provider", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                    />
                </div>
                <div className="field">
                    <label className="label">{ t("text.category") }</label>
                    <Controller
                        name="category"
                        control={ control }
                        defaultValue={ categoriesForSelect.filter((el: ISelect) => goodDataForForm.category.includes(el.id)) }
                        rules={ { required: t("errors.requiredField") } }
                        render={ ({ field }) => (
                            <>
                                <Autocomplete
                                    { ...field }
                                    multiple
                                    limitTags={ 2 }
                                    options={ categoriesForSelect.filter(
                                        (option: ISelect) => !field.value.some((selected: ISelect) => selected.id === option.id)
                                    ) }
                                    getOptionLabel={ (option) => option.label }
                                    onChange={ (_, value) => field.onChange(value) }
                                    value={ field.value }
                                    renderInput={ (params) => (
                                        <TextField 
                                            { ...params }
                                            error={ Boolean(errors.category) }
                                            helperText={ String(errors.category?.message || "") }
                                        />
                                    ) }
                                />
                            </>
                        ) }
                    />
                </div>
                <div className="field">
                    <label 
                        className="label"
                        htmlFor="update-good-description"
                    >{ t("text.description") }</label>
                    <TextField
                        error={ Boolean(errors.description) }
                        helperText={ String(errors.description?.message || "") }
                        defaultValue={ isEdit ? goodDataForForm.description : "" }
                        id="update-good-description"
                        placeholder={ t("text.description") }
                        { ...register("description", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        multiline
                        minRows={ 3 }
                        maxRows={ 3 }
                    />
                </div>
                <div className="field">
                    <label 
                        className="label"
                        htmlFor="update-good-fullDescription"
                    >{ t("text.fullDescription") }</label>
                    <TextField
                        error={ Boolean(errors.fullDescription) }
                        helperText={ String(errors.fullDescription?.message || "") }
                        defaultValue={ isEdit ? goodDataForForm.fullDescription : "" }
                        id="update-good-fullDescription"
                        placeholder={ t("text.fullDescription") }
                        { ...register("fullDescription", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                        multiline
                        minRows={ 3 }
                        maxRows={ 3 }
                    />
                </div>
                <div className="field">
                    <label className="label">{ t("text.images") }</label>
                    <Controller
                        name="images"
                        control={ control }
                        defaultValue={ goodDataForForm.images }
                        rules={ { required: t("errors.requiredField") } }
                        render={ ({ field }) => (
                            <>
                                <InputFile
                                    { ...field }
                                    width="25px"
                                    height="25px"
                                    multiple
                                    accept=".png, .jpg, .jpeg"
                                    onChange={ (e) => {
                                        const files = e.target.files;
                                        const blobArray = convertFileListToBlobArray(files);
                                        field.onChange(blobArray);
                                    } }
                                />
                                <span className="field-error-text">{ String(errors.images?.message || "") }</span>
                                <div className="additions">
                                    {
                                        watch("images", []).map((el: string, index: number) => (
                                            <Tooltip
                                                key={ el + index }
                                                title={
                                                    <img
                                                        width="300px"
                                                        height="180px"
                                                        src={ el } 
                                                    />
                                                }
                                                placement="top"
                                            >
                                                <a href={ el } target="__blank">
                                                    <img className="image" src={ el } />
                                                </a>
                                            </Tooltip>
                                        ))
                                    }
                                </div>
                            </>
                            
                        ) }
                    />
                </div>
                <div className="field">
                    <label className="label">{ t("text.video") }</label>
                    <Controller
                        name="video"
                        control={ control }
                        defaultValue={ goodDataForForm.video }
                        rules={ { required: t("errors.requiredField") } }
                        render={ ({ field }) => (
                            <>
                                <InputFile
                                    { ...field }
                                    width="25px"
                                    height="25px"
                                    accept=".mp4"
                                    onChange={ (e) => {
                                        const files = e.target.files;
                                        const blobArray = convertFileListToBlobArray(files);
                                        field.onChange(blobArray);
                                    } }
                                />
                                <span className="field-error-text">{ String(errors.video?.message || "") }</span>
                                <div className="additions">
                                    {
                                        watch("video")?.length !== 0 && 
                                        <Tooltip
                                            key={ watch("video") }
                                            title={
                                                <video
                                                    width="100%"
                                                    height="100%"
                                                    src={ watch("video") }
                                                    controls
                                                />
                                            }
                                            placement="top"
                                        >
                                            <video className="video" src={ watch("video") } />
                                        </Tooltip>
                                    }
                                </div>
                            </>
                            
                        ) }
                    />
                </div>
                <div className="field">
                    <label className="label">{ t("text.additionalProductInfo") }</label>
                    { additionalInfoFields.map((info: FieldArrayWithId<IProductForm, "additionalInfo", "id">, index: number) => {

                        const errorInfo: any = errors.additionalInfo || [];

                        return (
                            <Fragment key={ info.id + index }>
                                <div className="field-column">
                                    <div className="fields-data">
                                        <Controller
                                            name={ `additionalInfo.${index}.name` }
                                            control={ control }
                                            defaultValue={ info.name || "" }
                                            rules={ { required: "errors.requiredField" } }
                                            render={ ({ field }) => (
                                                <TextField
                                                    error={ Boolean(errorInfo[index]) }
                                                    helperText={ t(String(errorInfo[index]?.name?.message || "")) }
                                                    { ...field }
                                                    placeholder={ t("text.name") }
                                                />
                                            ) }
                                        />

                                        <Controller
                                            name={ `additionalInfo.${index}.description` }
                                            control={ control }
                                            defaultValue={ info.description || "" }
                                            rules={ { required: "errors.requiredField" } }
                                            render={ ({ field }) => (
                                                <TextField
                                                    error={ Boolean(errorInfo[index]) }
                                                    helperText={ t(String(errorInfo[index]?.description?.message || "")) }
                                                    className="variation-description"
                                                    { ...field }
                                                    placeholder={ t("text.description") }
                                                />
                                            ) }
                                        />
                                    </div>
                                    <div className="dynamic-actions">
                                        { index === additionalInfoFields?.length - 1 && (
                                        <IconButton className="mui-actions" onClick={ handleAddAdditionalInfo }>
                                            <BiMessageSquareAdd />
                                        </IconButton>
                                        ) }
                                        <IconButton className="mui-actions" onClick={ () => handleDeleteAdditionalData(index) }>
                                            <MdDelete />
                                        </IconButton>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    }) }
                </div>
                <div className="field">
                    <label className="label">{ t("text.variationsOfProduct") }</label>
                    { variationsInfoFields.map((info: FieldArrayWithId<IProductForm, "variations", "id">, index) => {

                        const errorInfo: any = errors.variations || [];
                        const isErrorShown = Boolean(errorInfo[index]);

                        return (
                            <Fragment key={ info.id + index }>
                                <div className="field-column">
                                    <div className="fields-data">
                                        <Controller
                                            name={ `variations.${index}.name` }
                                            control={ control }
                                            defaultValue={ info.name || "" }
                                            rules={ { required: "errors.requiredField" } }
                                            render={ ({ field }) => (
                                                <TextField
                                                    error={ isErrorShown }
                                                    helperText={ t(String(errorInfo[index]?.name?.message || "")) }
                                                    { ...field }
                                                    placeholder={ t("text.systemKey") }
                                                />
                                            ) }
                                        />

                                        <Controller
                                            name={ `variations.${index}.title` }
                                            control={ control }
                                            defaultValue={ info.title || "" }
                                            rules={ { required: "errors.requiredField" } }
                                            render={ ({ field }) => (
                                                <TextField
                                                    error={ isErrorShown }
                                                    helperText={ t(String(errorInfo[index]?.title?.message || "")) }
                                                    className="variation-title"
                                                    { ...field }
                                                    placeholder={ t("text.name") }
                                                />
                                            ) }
                                        />
                                        <Controller
                                            name={ `variations.${index}.stock` }
                                            control={ control }
                                            defaultValue={ info.stock || 0 }
                                            rules={ { required: "errors.requiredField" } }
                                            render={ ({ field }) => (
                                                <TextField
                                                    error={ isErrorShown }
                                                    helperText={ t(String(errorInfo[index]?.stock?.message || "")) }
                                                    className="variation-stock"
                                                    { ...field }
                                                    placeholder={ t("text.stock") }
                                                />
                                            ) }
                                        />
                                        <Controller
                                            name={ `variations.${index}.price` }
                                            control={ control }
                                            defaultValue={ info.stock || 0 }
                                            rules={ { required: "errors.requiredField" } }
                                            render={ ({ field }) => (
                                                <TextField
                                                    error={ isErrorShown }
                                                    helperText={ t(String(errorInfo[index]?.price?.message || "")) }
                                                    className="variation-price"
                                                    { ...field }
                                                    placeholder={ t("text.price") }
                                                />
                                            ) }
                                        />
                                    </div>
                                    <div className="dynamic-actions">
                                        { index === variationsInfoFields?.length - 1 && (
                                        <IconButton className="mui-actions" onClick={ handleAddVariation }>
                                            <BiMessageSquareAdd />
                                        </IconButton>
                                        ) }
                                        <IconButton className="mui-actions" onClick={ () => handleDeleteVariation(index) }>
                                            <MdDelete />
                                        </IconButton>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    }) }
                </div>
                <div className="form-actions">
                    <Button 
                        type="submit"
                        disabled={ submitCount !== 0 && !isValid }
                        variant="contained"
                    >{ t("text.confirm") }</Button>
                     <Button 
                        type="submit"
                        onClick={ handleCancelUpdating }
                        variant="contained"
                    >{ t("text.close") }</Button>
                </div>
            </div> 
        </form>
    );
};
