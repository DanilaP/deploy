import { Button, Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { DEFAULT_CATEGORYS, DEFAULT_PRODUCT } from "./constants";
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
    const [categorys, setCategorys] = useState(DEFAULT_CATEGORYS);
    const isEdit = mode === "edit";
    
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

    const handleUpdateCategory = (value) => {
        setNewGoodData({ ...newGoodData, category: value[0]?.label });
    };

    const handleUpdateSaveGoodData = () => {
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
            <div className="field-group">
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
            </div>
            <div className="field">
                    <label className="label" htmlFor="update-good-category">{t("text.category")}</label>
                    <Autocomplete
                        multiple
                        limitTags={2}
                        onChange={(_, value) => handleUpdateCategory(value)}
                        defaultValue={ isEdit ? [
                            categorys[0],
                        ]: [] }
                        options={categorys}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>
            <div className="field-group">
                <div className="field">
                    <label className="label" htmlFor="update-good-description">{t("text.description")}</label>
                    <TextField
                        multiline
                        minRows={3}
                        maxRows={3}
                        onChange={(e) => setNewGoodData({ ...newGoodData, description: e.target.value })}
                        id="update-good-description"
                        placeholder={t("text.description")}
                        defaultValue={ isEdit ? newGoodData?.description : "" }
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-full-description">{t("text.fullDescription")}</label>
                    <TextField
                        multiline
                        minRows={3}
                        maxRows={3}
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
                    />
                    <div className="additions">
                        {
                            newGoodData.images.map(el => (
                                <img className="image" key={el} src={el} />
                            ))
                        }
                    </div>
                </div>
                <div className="field-inline">
                    <label className="label" htmlFor="update-good-video">{t("text.video")}</label>
                    <InputFile 
                        width="25px" 
                        height="25px"
                        accept=".mp4"
                        onChange={(e) => setNewGoodData({ ...newGoodData, video: convertFileListToBlobArray(e.target.files)[0] })}
                    />
                    <div className="additions">
                        {
                            newGoodData.video.length !== 0 && 
                            <video className="video" src={newGoodData.video} />
                        }
                    </div>
                </div>
            </div>
            <div className="field">
                <label className="label" >{t("text.additionalProductInfo")}</label>
                {
                    newGoodData?.additionalInfo.map((info, index) => {
                        return (
                            <div className="field-column" key={info.id}>
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
                                    && <IconButton className="mui-actions" onClick={handleAddAdditionalInfo}>
                                        <AddBoxIcon />
                                    </IconButton>
                                }
                                <IconButton className="mui-actions" onClick={() => handleDeleteAdditionalData(index)}>
                                    <BackspaceIcon />
                                </IconButton>
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
                            <div className="field-column" key={info.images[0]}>
                                <TextField
                                    defaultValue={info.name}
                                    placeholder={t("text.systemKey")}
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
                                    ? <IconButton className="mui-actions" onClick={handleAddVariation}>
                                        <AddBoxIcon />
                                    </IconButton> : <div className="hide-add"></div>
                                }
                                <IconButton className="mui-actions" onClick={() => handleDeleteVariationData(index)}>
                                    <BackspaceIcon />
                                </IconButton>
                            </div>
                        );
                    })
                }
            </div>
            <div className="form-actions">
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
