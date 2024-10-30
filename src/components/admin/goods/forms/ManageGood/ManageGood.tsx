import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { DEFAULT_PRODUCT } from "./constants";
import { useTranslation } from "react-i18next";
import { IAdditionalInfo, IProduct, IVariation } from "../../../../../interfaces/interfaces";
import { validateAdditionalInfo, validateCommonFields, validateVariations } from "./validators";
import { convertFileListToBlobArray } from "../../../../../helpers/convert-file-list-to-blob-array";
import AddBoxIcon from '@material-ui/icons/AddBox';
import BackspaceIcon from '@material-ui/icons/Backspace';
import InputFile from "../../../../../components-ui/custom-file-nput/file-input";
import "./ManageGood.scss";

export const ManageGoodForm = ({ 
    mode,
    goodData,
    handleCancelUpdating,
    handleUpdateGood
}: {
    mode: "edit" | "create" | null,
    goodData?: IProduct | null,
    handleUpdateGood: (goodData: IProduct) => void,
    handleCancelUpdating: () => void
}) => {
    
    const { t } = useTranslation();
    const [newGoodData, setNewGoodData] = useState<IProduct>(goodData || DEFAULT_PRODUCT);
    const isEdit = mode === "edit";
    
    const handleAddAdditionalInfo = () => {
        setNewGoodData(prevGoodData => {
            return {
                ...prevGoodData,
                additionalInfo: [...prevGoodData.additionalInfo, { name: "", description: "" }]
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

    const handleUpdateSaveGoodData = () => {
        console.log(validateCommonFields(newGoodData));
        
        if (
            validateCommonFields(newGoodData) && 
            validateAdditionalInfo(newGoodData.additionalInfo) &&
            validateVariations(newGoodData.variations)
        ) {
            handleUpdateGood(newGoodData);
        }
    };
    
    useEffect(() => {
        if (goodData) {
            setNewGoodData(goodData);
        }
    }, [goodData]);

    return (
        <div className="update-good-form">
            <div className="field-mid-group">
                <div className="field">
                    <label className="label" htmlFor="update-good-name">{t("text.name")}</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, name: e.target.value })}
                        id="update-good-name"
                        placeholder={t("text.name")}
                        defaultValue={ isEdit ? newGoodData?.name : "" }
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-provider">{t("text.provider")}</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, provider: e.target.value })}
                        id="update-good-provider"
                        placeholder={t("text.provider")}
                        defaultValue={ isEdit ? newGoodData?.provider : "" }
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-category">{t("text.category")}</label>
                      <Select
                        defaultValue={ isEdit ? newGoodData?.category : "" }
                        onChange={(e) => setNewGoodData({ ...newGoodData, category: e.target.value })}
                    >
                        <MenuItem value="Вычислительная техника">Вычислительная техника</MenuItem>
                    </Select>
                </div>
            </div>
            <div className="field-group">
                <div className="field">
                    <label className="label" htmlFor="update-good-description">{t("text.description")}</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, description: e.target.value })}
                        id="update-good-description"
                        placeholder={t("text.description")}
                        defaultValue={ isEdit ? newGoodData?.description : "" }
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-full-description">{t("text.fullDescription")}</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, fullDescription: e.target.value })}
                        id="update-good-full-description"
                        placeholder={t("text.fullDescription")}
                        defaultValue={ isEdit ? newGoodData?.fullDescription : "" }
                    />
                </div>
            </div>
            <div className="field-group">
                <div className="field-inline">
                    <label className="label" htmlFor="update-good-images">{t("text.images")}</label>
                    <InputFile 
                        width="25px" 
                        height="25px"
                        multiple 
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => setNewGoodData({ ...newGoodData, images: convertFileListToBlobArray(e.target.files) })}
                    /> ({newGoodData.images.length})
                </div>
                <div className="field-inline">
                    <label className="label" htmlFor="update-good-video">{t("text.video")}</label>
                    <InputFile 
                        width="25px" 
                        height="25px"
                        accept=".mp4"
                        onChange={(e) => setNewGoodData({ ...newGoodData, video: convertFileListToBlobArray(e.target.files)[0] })}
                    /> ({ newGoodData.video.length !== 0 ? 1 : 0 })
                </div>
            </div>
            <div className="field">
                <label className="label" >{t("text.additionalProductInfo")}</label>
                {
                    newGoodData?.additionalInfo.map((info, index) => {
                        return (
                            <div className="field-column">
                                <TextField
                                    defaultValue={info.name}
                                    placeholder={t("text.name")}
                                    onChange={(el) => {
                                        handleUpdateAdditionalData({ ...info, name: el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.description}
                                    placeholder={t("text.value")}
                                    onChange={(el) => {
                                        handleUpdateAdditionalData({ ...info, description: el.target.value }, index);
                                    }}
                                />
                                { index === newGoodData.additionalInfo.length - 1 
                                    && <AddBoxIcon onClick={handleAddAdditionalInfo} />
                                }
                                <BackspaceIcon
                                    onClick={() => handleDeleteAdditionalData(index)}
                                />
                            </div>
                        );
                    })
                }
            </div>
            <div className="field">
                <label className="label" htmlFor="update-good-variations-info">{t("text.variationsOfProduct")}</label>
                {
                    newGoodData?.variations.map((info, index) => {
                        return (
                            <div className="field-column">
                                <TextField
                                    defaultValue={info.name}
                                    placeholder={t("text.name")}
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, name: el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.title}
                                    placeholder={t("text.value")}
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, title: el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.price}
                                    placeholder={t("text.price")}
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, price: +el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.stock}
                                    placeholder={t("text.stock")}
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, stock: +el.target.value }, index);
                                    }}
                                />
                                { index === newGoodData.variations.length - 1 
                                    ? <AddBoxIcon onClick={handleAddVariation} /> : <div className="hide-add"></div>
                                }
                                <BackspaceIcon onClick={() => handleDeleteVariationData(index)} />
                            </div>
                        );
                    })
                }
            </div>
            <div className="actions">
                <Button 
                    onClick={ handleUpdateSaveGoodData }
                    variant="contained"
                >
                    { t("text.confirm") }
                </Button>
                <Button onClick={ handleCancelUpdating } variant="contained">{ t("text.close") }</Button>
            </div>
        </div>
    );
};
