import { Button, Autocomplete, TextField, Tooltip, Checkbox } from "@mui/material";
import { Fragment, useEffect } from "react";
import { DEFAULT_PRODUCT_FORM_VALUES } from "./constants";
import { useTranslation } from "react-i18next";
import { IAdditionalInfo, IProduct, ISelect, IVariation } from "../../../../../interfaces/interfaces";
import { BiMessageSquareAdd } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useForm, Controller, useFieldArray, FieldArrayWithId } from "react-hook-form";
import { validateRequiredField } from "../../../../../helpers/validators-helper";
import { convertFileListToBlobArray } from "../../../../../helpers/convert-file-list-to-blob-array";
import IconButton from "@mui/material/IconButton";
import InputFile from "../../../../../components-ui/custom-file-nput/file-input";
import "./ManageGood.scss";

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
    price: number,
    active: boolean,
    published: boolean,
    variations: IVariation[],
}

export const ManageGoodForm = ({ 
    mode,
    goodData,
    categoriesForSelect,
    handleCancelUpdating,
    handleUpdateGood,
    handleUnsavedDataExist
}: {
    mode: "edit" | "create" | null,
    goodData?: IProduct | null,
    categoriesForSelect: ISelect[],
    handleUpdateGood: (goodData: IProduct) => void,
    handleCancelUpdating: () => void,
    handleUnsavedDataExist: (status: boolean) => void
}) => {
    
    const { t } = useTranslation();
    const isEdit = mode === "edit";
    
    const { 
        handleSubmit, 
        watch, 
        register,
        clearErrors,
        setError,
        trigger,
        control,
        formState: { errors, isValid, submitCount, isDirty }
    } = useForm<IProductForm>({
        defaultValues: goodData 
            ? {
                ...goodData,
                category: categoriesForSelect.filter(el => goodData.category.includes(el.id)),
                additionalInfo: goodData.additionalInfo,
                variations: goodData.variations
            }
            : DEFAULT_PRODUCT_FORM_VALUES,
    });
    
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
        if (submitCount !== 0) {
            setError(`variations.${variationsInfoFields .length}.name`, {
                type: "custom",
                message: "errors.requiredField"
            });
            setError(`variations.${variationsInfoFields.length}.title`, {
                type: "custom",
                message: "errors.requiredField"
            });
            trigger("variations");
        }
    };
    
    const handleDeleteVariation = (index: number) => {
        removeVariation(index);
    };
    
    const handleAddAdditionalInfo = () => {
        appendAdditionalInfo({ id: Date.now(), name: '', description: '' });
        if (submitCount !== 0) {
            setError(`additionalInfo.${additionalInfoFields.length}.name`, {
                type: "custom",
                message: "errors.requiredField"
            });
            setError(`additionalInfo.${additionalInfoFields.length}.description`, {
                type: "custom",
                message: "errors.requiredField"
            });
            trigger("additionalInfo");
        }
    };
    
    const handleDeleteAdditionalData = (index: number) => {
        removeAdditionalInfo(index);
    };

    const handleClearPriceError = () => {
        clearErrors('price');
        return true;
    };

    useEffect(() => {
        handleUnsavedDataExist(isDirty);
    }, [isDirty]);
    
    useEffect(() => {
        if (!watch('price') && submitCount !== 0 && variationsInfoFields.length === 0) {
            setError('price', {
                type: 'custom',
                message: t("errors.requiredField")
            });
        } else {
            clearErrors('price');
        }
    }, [variationsInfoFields]);

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
                        id="update-good-provider"
                        placeholder={ t("text.provider") }
                        { ...register("provider", {
                            validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                        }) }
                    />
                </div>
                <div className="field">
                    <label 
                        className="label"
                    >{ t("text.category") }</label>
                    <Controller
                        name="category"
                        control={ control }
                        rules={ { required: t("errors.requiredField") } }
                        render={ ({ field }) => (
                            <>
                                <Autocomplete
                                    { ...field }
                                    multiple
                                    limitTags={ 3 }
                                    options={ 
                                        categoriesForSelect.filter(optionValue => {
                                            return !field.value.some(selectedValue => optionValue.id === selectedValue.id );
                                        })
                                    }
                                    onChange={ (_, value) => field.onChange(value) }
                                    renderInput={ (params) => (
                                        <TextField
                                            placeholder={ t("text.search") }
                                            { ...params }
                                            id="update-good-category"
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
                    <div className="field-row-label">
                        <label className="label">{ t("text.images") }</label>
                        <Controller
                            name="images"
                            control={ control }
                            rules={ { required: t("errors.requiredField") } }
                            render={ ({ field }) => (
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
                            ) }
                        />
                    </div>
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
                </div>
                <div className="field">
                    <div className="field-row-label">
                        <label className="label">{ t("text.video") }</label>
                        <Controller
                            name="video"
                            control={ control }
                            render={ ({ field }) => (
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
                            ) }
                        />
                    </div>
                    <span className="field-error-text">{ String(errors.video?.message || "") }</span>
                    <div className="additions">
                        {
                            (watch("video")?.length !== 0)
                            ? <Tooltip
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
                            : null
                        }
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        { t("text.additionalProductInfo") }
                        { 
                            additionalInfoFields.length === 0
                            ? (
                                <IconButton className="mui-actions" onClick={ handleAddAdditionalInfo }>
                                    <BiMessageSquareAdd />
                                </IconButton>
                            ) 
                            : null
                        }
                    </label>
                    { additionalInfoFields.map((info: FieldArrayWithId<IProductForm, "additionalInfo", "id">, index: number) => {

                        const errorInfo: any = errors.additionalInfo || [];

                        return (
                            <Fragment key={ info.id + index }>
                                <div className="field-column">
                                    <div className="fields-data">
                                        <TextField
                                            error={ Boolean(errorInfo[index]?.name) }
                                            helperText={ t(String(errorInfo[index]?.name?.message || "")) }
                                            { ...register(
                                                `additionalInfo.${index}.name`, {
                                                    validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                                                }) 
                                            }
                                            placeholder={ t("text.name") }
                                        />

                                        <TextField
                                            className="variation-description"
                                            error={ Boolean(errorInfo[index]?.description) }
                                            helperText={ t(String(errorInfo[index]?.description?.message || "")) }
                                            { ...register(
                                                `additionalInfo.${index}.description`, {
                                                    validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                                                }) 
                                            }
                                            placeholder={ t("text.description") }
                                        />
                                    </div>
                                    <div className="dynamic-actions">
                                        { 
                                        (index === additionalInfoFields?.length - 1) 
                                            ? (
                                                <IconButton className="mui-actions" onClick={ handleAddAdditionalInfo }>
                                                    <BiMessageSquareAdd />
                                                </IconButton>
                                            ) 
                                            : null
                                        }
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
                    <label className="label">
                        { t("text.variationsOfProduct") }
                        { 
                            variationsInfoFields.length === 0 
                            ? (
                                <IconButton className="mui-actions" onClick={ handleAddVariation }>
                                    <BiMessageSquareAdd />
                                </IconButton>
                            ) 
                            : null
                        }
                    </label>
                    { variationsInfoFields.map((info: FieldArrayWithId<IProductForm, "variations", "id">, index) => {

                        const errorInfo: any = errors.variations || [];

                        return (
                            <Fragment key={ info.id + index }>
                                <div className="field-column">
                                    <div className="fields-data">
                                        <TextField
                                            error={ Boolean(errorInfo[index]?.name) }
                                            helperText={ t(String(errorInfo[index]?.name?.message || "")) }
                                            { ...register(
                                                `variations.${index}.name`, {
                                                    validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                                                }) 
                                            }
                                            placeholder={ t("text.systemKey") }
                                        />

                                        <TextField
                                            error={ Boolean(errorInfo[index]?.title) }
                                            helperText={ t(String(errorInfo[index]?.title?.message || "")) }
                                            className="variation-title"
                                            { ...register(
                                                `variations.${index}.title`, {
                                                    validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                                                }) 
                                            }
                                            placeholder={ t("text.name") }
                                        />
                                        <TextField
                                            error={ Boolean(errorInfo[index]?.stock) }
                                            helperText={ t(String(errorInfo[index]?.stock?.message || "")) }
                                            className="variation-stock"
                                            { ...register(
                                                `variations.${index}.stock`, {
                                                    validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                                                }) 
                                            }
                                            placeholder={ t("text.stock") }
                                        />
                                        <TextField
                                            error={ Boolean(errorInfo[index]?.price) }
                                            helperText={ t(String(errorInfo[index]?.price?.message || "")) }
                                            className="variation-price"
                                            { ...register(
                                                `variations.${index}.price`, {
                                                    validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                                                }) 
                                            }
                                            placeholder={ t("text.price") }
                                        />
                                    </div>
                                    <div className="dynamic-actions">
                                        { 
                                        (index === variationsInfoFields?.length - 1) 
                                            ? (
                                                <IconButton className="mui-actions" onClick={ handleAddVariation }>
                                                    <BiMessageSquareAdd />
                                                </IconButton>
                                            ) 
                                            : null
                                        }
                                        <IconButton className="mui-actions" onClick={ () => handleDeleteVariation(index) }>
                                            <MdDelete />
                                        </IconButton>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    }) }
                </div>
                <div className="field gap">
                    <label 
                        className="label"
                        htmlFor="update-good-price"
                    >{ t("text.price") }</label>
                    <TextField
                        error={ Boolean(errors.price) }
                        helperText={ String(errors.price?.message || "") }
                        id="update-good-price"
                        placeholder={ t("text.price") }
                        { ...register("price", {
                            validate: (value) => watch('variations').length === 0 
                                ? validateRequiredField(value) ? true : t("errors.requiredField")
                                : handleClearPriceError()
                        }) }
                    />
                </div>
                <div className="field">
                    <div className="field-column">
                        <div className="fields-half">
                            <div className="column">
                                <label className="label">{ t("text.publish") }</label>
                                <Controller
                                    name="published"
                                    control={ control }
                                    render={ ({ field }) => (
                                        <Checkbox
                                            className="field-checkbox"
                                            { ...field }
                                            defaultChecked={ goodData?.published }
                                            onChange={ e => field.onChange(e.target.checked) }
                                        />
                                    ) }
                                />
                            </div>
                            <div className="column">
                                <label className="label">{ t("text.active") }</label>
                                <Controller
                                    name="active"
                                    control={ control }
                                    render={ ({ field }) => (
                                        <Checkbox
                                            className="field-checkbox"
                                            { ...field }
                                            defaultChecked={ goodData?.active }
                                            onChange={ e => field.onChange(e.target.checked) }
                                        />
                                    ) }
                                />
                            </div>
                        </div>
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
                        onClick={ handleCancelUpdating }
                        variant="contained"
                    >{ t("text.cancel") }</Button>
                </div>
            </div> 
        </form>
    );
};
