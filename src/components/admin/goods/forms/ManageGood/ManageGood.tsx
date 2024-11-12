import { Button, Autocomplete, TextField, Tooltip } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { DEFAULT_PRODUCT } from "./constants";
import { useTranslation } from "react-i18next";
import { IAdditionalInfo, IProduct, ISelect, IVariation } from "../../../../../interfaces/interfaces";
import { validateGoodsForm } from "./validators";
import { convertFileListToBlobArray } from "../../../../../helpers/convert-file-list-to-blob-array";
import { BiMessageSquareAdd } from "react-icons/bi";
import InputFile from "../../../../../components-ui/custom-file-nput/file-input";
import "./ManageGood.scss";
import { MdDelete } from "react-icons/md";
import lodash from "lodash";
import { useCategoryHelper } from "../../../../../helpers/use-category-helper";

export const ManageGoodForm = ({ 
    mode,
    goodData,
    providersForSelect,
    handleCancelUpdating,
    handleUpdateGood,
    handleUnsavedDataExist
}: {
    mode: "edit" | "create" | null,
    goodData?: IProduct | null,
    providersForSelect: ISelect[],
    handleUpdateGood: (goodData: IProduct) => void,
    handleCancelUpdating: () => void,
    handleUnsavedDataExist: (status: boolean) => void
}) => {
    
    const { t } = useTranslation();
    const [newGoodData, setNewGoodData] = useState<IProduct>(goodData || DEFAULT_PRODUCT);
    const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
    const formWrapperRef = useRef<HTMLDivElement>(null);
    const isEdit = mode === "edit";
    
    const validationFormData = validateGoodsForm(newGoodData);
    const { categoriesForSelect } = useCategoryHelper();
    
    const handleAddAdditionalInfo = () => {
        setNewGoodData(prevGoodData => {
            return {
                ...prevGoodData,
                additionalInfo: [...prevGoodData.additionalInfo, { name: "", description: "", id: Date.now() }]
            };
        });
    };

    const handleDeleteAdditionalData = (deleteIndex: number) => {
        if (deleteIndex === 0 && newGoodData.additionalInfo.length === 1) return;
        setNewGoodData(prevGoodData => {
            return {
                ...prevGoodData,
                additionalInfo: prevGoodData.additionalInfo.filter((_, index) => index !== deleteIndex)
            };
        });
    };

    const handleUpdateAdditionalData = (additionalData: IAdditionalInfo, updateIndex: number) => {
        setNewGoodData(prevGoodData => {
            return {
                ...prevGoodData,
                additionalInfo: prevGoodData.additionalInfo.map((info, index) => {
                    if (updateIndex === index) {
                        return additionalData;
                    }
                    return info;
                })
            };
        });
    };

    const handleAddVariation = () => {
        setNewGoodData(prevGoodData => {
            return {
                ...prevGoodData,
                variations: [...prevGoodData.variations, 
                    { name: "", title: "", stock: 1, price: 1, images: [""], video: "" }
                ]
            };
        });
    };

    const handleDeleteVariationData = (deleteIndex: number) => {
        if (deleteIndex === 0 && newGoodData.variations.length === 1) return;
        setNewGoodData(prevGoodData => {
            return {
                ...prevGoodData,
                variations: prevGoodData.variations.filter((_, index) => index !== deleteIndex)
            };
        });
    };

    const handleUpdateVariationData = (variationData: IVariation, updateIndex: number) => {
        setNewGoodData(prevGoodData => {
            return {
                ...prevGoodData,
                variations: prevGoodData.variations.map((info, index) => {
                    if (updateIndex === index) {
                        return variationData;
                    }
                    return info;
                })
            };
        });
    };

    const handleUpdateCategory = (value: ISelect[]) => {
        setNewGoodData({ ...newGoodData, category: value.map(el => el.id) });
    };

    const handleUpdateProvider = (value: ISelect | null) => {
        setNewGoodData({ ...newGoodData, provider: value?.id || "" });
    };

    const handleUpdateSaveGoodData = () => {
        setIsFormTouched(true);
        if (
            validationFormData.formValid
        ) {
            handleUpdateGood(newGoodData);
        }
    };

    useEffect(() => {
        if (goodData) {
            setNewGoodData(goodData);
        }
    }, [goodData]);

    useEffect(() => {
        handleUnsavedDataExist(!lodash.isEqual(newGoodData, goodData));
    }, [newGoodData]);

    useEffect(() => {
        if (isFormTouched && formWrapperRef.current) {
            const formLabels = formWrapperRef.current.getElementsByClassName("label");
            for (let i = 0, max = formLabels.length; i < max; i++) {
                const isError = formLabels[i].getAttribute("data-error") === "true";
                if (isError) {
                    formLabels[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                }
            }
        }
    }, [isFormTouched]);
    
    return (
        <div className="update-good-form" ref={ formWrapperRef }>
            <div className="field">
                <label 
                    className="label"
                    htmlFor="update-good-articleNumber"
                    data-error={ Boolean(validationFormData?.articleNumber) }
                >{ t("text.articleNumber") }</label>
                <TextField
                    error={ Boolean(validationFormData?.articleNumber) && isFormTouched }
                    helperText={ isFormTouched && t(validationFormData?.articleNumber?.error) }
                    onChange={ (e) => setNewGoodData({ ...newGoodData, articleNumber: e.target.value }) }
                    id="update-good-articleNumber"
                    placeholder={ t("text.articleNumber") }
                    defaultValue={ isEdit ? newGoodData?.articleNumber : "" }
                />
            </div>
            <div className="field">
                <label 
                    className="label" 
                    htmlFor="update-good-name"
                    data-error={ Boolean(validationFormData?.name) }
                >{ t("text.name") }</label>
                <TextField
                    error={ Boolean(validationFormData?.name) && isFormTouched }
                    helperText={ isFormTouched && t(validationFormData?.name?.error) }
                    onChange={ (e) => setNewGoodData({ ...newGoodData, name: e.target.value }) }
                    id="update-good-name"
                    placeholder={ t("text.name") }
                    className="input"
                    defaultValue={ isEdit ? newGoodData?.name : "" }
                />
            </div>
            <div className="field">
                <label 
                    className="label"
                    htmlFor="update-good-provider"
                    data-error={ Boolean(validationFormData?.provider) }
                >{ t("text.provider") }</label>
                <Autocomplete
                    id="update-good-provider"
                    onChange={ (_, value) => handleUpdateProvider(value) }
                    value={ providersForSelect.length !== 0
                        ? providersForSelect.filter(el => Number(el.id) === newGoodData.provider)[0]
                        : {} as ISelect
                    }
                    options={ providersForSelect }
                    renderInput={ (params) => <TextField { ...params } /> }
                />
                { validationFormData.provider && isFormTouched && 
                    <span className="field-error-text">{ t(validationFormData.provider.error) }</span>
                }
            </div>
            <div className="field">
                <label 
                    className="label" 
                    htmlFor="update-good-category"
                    data-error={ Boolean(validationFormData?.category) }
                >{ t("text.category") }</label>
                <Autocomplete
                    id="update-good-category"
                    multiple
                    limitTags={ 2 }
                    onChange={ (_, value) => handleUpdateCategory(value) }
                    value={ categoriesForSelect.length !== 0
                        ? categoriesForSelect.filter(el => newGoodData.category.includes(el.id))
                        : []
                    }
                    options={ categoriesForSelect }
                    renderInput={ (params) => <TextField { ...params } /> }
                />
                { validationFormData.category && isFormTouched && 
                    <span className="field-error-text">{ t(validationFormData.category.error) }</span>
                }
            </div>
            <div className="field">
                <label 
                    className="label" 
                    htmlFor="update-good-description"
                    data-error={ Boolean(validationFormData?.description) }
                >{ t("text.description") }</label>
                <TextField
                    error={ Boolean(validationFormData?.description) && isFormTouched }
                    helperText={ isFormTouched && t(validationFormData?.description?.error) }
                    multiline
                    minRows={ 3 }
                    maxRows={ 3 }
                    onChange={ (e) => setNewGoodData({ ...newGoodData, description: e.target.value }) }
                    id="update-good-description"
                    placeholder={ t("text.description") }
                    defaultValue={ isEdit ? newGoodData?.description : "" }
                />
            </div>
            <div className="field">
                <label 
                    className="label" 
                    htmlFor="update-good-full-description"
                    data-error={ Boolean(validationFormData?.fullDescription) }
                >{ t("text.fullDescription") }</label>
                <TextField
                    error={ Boolean(validationFormData?.fullDescription) && isFormTouched }
                    helperText={ isFormTouched && t(validationFormData?.fullDescription?.error) }
                    multiline
                    minRows={ 3 }
                    maxRows={ 3 }
                    onChange={ (e) => setNewGoodData({ ...newGoodData, fullDescription: e.target.value }) }
                    id="update-good-full-description"
                    placeholder={ t("text.fullDescription") }
                    defaultValue={ isEdit ? newGoodData?.fullDescription : "" }
                />
            </div>
            <div className="field">
                <label 
                    className="label" 
                    id="update-good-images"
                    data-error={ Boolean(validationFormData?.images) }
                >
                    { t("text.images") }
                    <InputFile
                        width="25px" 
                        height="25px"
                        multiple 
                        accept=".png, .jpg, .jpeg"
                        onChange={ (e) => setNewGoodData({ ...newGoodData, images: convertFileListToBlobArray(e.target.files) }) }
                    />
                </label>
                <div className="additions">
                    {
                        newGoodData.images.map((el, index) => (
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
                { validationFormData.images && isFormTouched && 
                    <span className="field-error-text">{ t(validationFormData.images.error) }</span>
                }
            </div>
            <div className="field">
                <label 
                    className="label" 
                    id="update-good-video"
                    data-error={ Boolean(validationFormData?.video) }
                >
                    { t("text.video") }
                    <InputFile 
                        width="25px" 
                        height="25px"
                        accept=".mp4"
                        onChange={ (e) => setNewGoodData({ ...newGoodData, video: convertFileListToBlobArray(e.target.files)[0] }) }
                    />
                </label>
                <div className="additions">
                    {
                        newGoodData.video.length !== 0 && 
                        <Tooltip
                            key={ newGoodData.video }
                            title={
                                <video
                                    width="100%"
                                    height="100%"
                                    src={ newGoodData.video }
                                    controls
                                />
                            }
                            placement="top"
                        >
                            <video className="video" src={ newGoodData.video } />
                        </Tooltip>
                    }
                </div>
                { validationFormData.video && isFormTouched && 
                    <span className="field-error-text">{ t(validationFormData.video.error) }</span>
                }
            </div>
            <div className="field">
                <label 
                    className="label" 
                    id="update-good-additionalInfo"
                    data-error={ Boolean(validationFormData?.additionalInfo) }
                >{ t("text.additionalProductInfo") }</label>
                {
                    newGoodData?.additionalInfo.map((info, index) => {
                        const validationData = validationFormData.additionalInfo && validationFormData.additionalInfo[index] || {};
                        const isErrorShown = Boolean(validationData) && isFormTouched;
                        return (
                            <Fragment key={ info.id }>
                                <div className="field-column">
                                    <div className="fields-data">
                                        <TextField
                                            error={ isErrorShown }
                                            helperText={ isErrorShown ? t(validationData?.name?.error) : "" }
                                            defaultValue={ info.name }
                                            placeholder={ t("text.name") }
                                            onChange={ (el) => {
                                                handleUpdateAdditionalData({ ...info, name: el.target.value }, index);
                                            } }
                                        />
                                        <TextField
                                            error={ isErrorShown }
                                            helperText={ isErrorShown ? t(validationData?.description?.error) : "" }
                                            className="variation-description"
                                            defaultValue={ info.description }
                                            placeholder={ t("text.value") }
                                            onChange={ (el) => {
                                                handleUpdateAdditionalData({ ...info, description: el.target.value }, index);
                                            } }
                                        />
                                    </div>
                                    <div className="dynamic-actions">
                                        { index === newGoodData.additionalInfo.length - 1 
                                            && <IconButton className="mui-actions" onClick={ handleAddAdditionalInfo }>
                                                <BiMessageSquareAdd />
                                            </IconButton>
                                        }
                                        <IconButton className="mui-actions" onClick={ () => handleDeleteAdditionalData(index) }>
                                            <MdDelete />
                                        </IconButton>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })
                }
            </div>
            <div className="field">
                <label 
                    className="label"
                    id="update-good-variations"
                    data-error={ Boolean(validationFormData?.variations) }
                >{ t("text.variationsOfProduct") }</label>
                {
                    newGoodData?.variations.map((info, index) => {
                        const validationData = validationFormData.variations && validationFormData.variations[index];
                        const isErrorShown = Boolean(validationData) && isFormTouched;
                        return (
                            <div className="field-column" key={ info.images[0] + index }>
                                <div className="fields-data">
                                    <TextField
                                        error={ isErrorShown }
                                        helperText={ isErrorShown ? t(validationData?.name?.error) : "" }
                                        defaultValue={ info.name }
                                        placeholder={ t("text.systemKey") }
                                        onChange={ (el) => {
                                            handleUpdateVariationData({ ...info, name: el.target.value }, index);
                                        } }
                                    />
                                    <TextField
                                        error={ isErrorShown }
                                        helperText={ isErrorShown ? t(validationData?.title?.error) : "" }
                                        defaultValue={ info.title }
                                        placeholder={ t("text.value") }
                                        onChange={ (el) => {
                                            handleUpdateVariationData({ ...info, title: el.target.value }, index);
                                        } }
                                    />
                                    <TextField
                                        error={ isErrorShown }
                                        helperText={ isErrorShown ? t(validationData?.price?.error) : "" }
                                        defaultValue={ info.price }
                                        placeholder={ t("text.price") }
                                        onChange={ (el) => {
                                            handleUpdateVariationData({ ...info, price: +el.target.value }, index);
                                        } }
                                    />
                                    <TextField
                                        error={ isErrorShown }
                                        helperText={ isErrorShown ? t(validationData?.stock?.error) : "" }
                                        defaultValue={ info.stock }
                                        placeholder={ t("text.stock") }
                                        onChange={ (el) => {
                                            handleUpdateVariationData({ ...info, stock: +el.target.value }, index);
                                        } }
                                    />
                                </div>
                                <div className="dynamic-actions">
                                    { index === newGoodData.variations.length - 1 &&
                                        <IconButton className="mui-actions" onClick={ handleAddVariation }>
                                            <BiMessageSquareAdd />
                                        </IconButton>
                                    }
                                    <IconButton className="mui-actions" onClick={ () => handleDeleteVariationData(index) }>
                                        <MdDelete />
                                    </IconButton>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className="form-actions">
                <Button 
                    onClick={ handleUpdateSaveGoodData }
                    variant="contained"
                    disabled={ !validationFormData.formValid && isFormTouched }
                >
                    { t("text.confirm") }
                </Button>
                <Button onClick={ handleCancelUpdating } variant="contained">{ t("text.close") }</Button>
            </div>
        </div>
    );
};
