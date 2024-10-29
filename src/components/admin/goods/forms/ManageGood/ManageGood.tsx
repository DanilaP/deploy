import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import "./ManageGood.scss";
import { useTranslation } from "react-i18next";
import { IAdditionalInfo, IProduct, IVariation } from "../../../../../interfaces/interfaces";
import AddBoxIcon from '@material-ui/icons/AddBox';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { DEFAULT_PRODUCT } from "./constants";

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
    const [newGoodData, setNewGoodData] = useState(goodData || DEFAULT_PRODUCT);
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
                    { name: "-", title: "-", stock: 1, price: 1, images: [""], video: "" }
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
        if (
            newGoodData?.category.length !== 0 &&
            newGoodData?.name.length !== 0 &&
            newGoodData?.provider.length !== 0 &&
            newGoodData?.description.length !== 0 &&
            newGoodData?.fullDescription.length !== 0 &&
            newGoodData?.images &&
            newGoodData?.video &&
            newGoodData?.provider.length !== 0 &&
            newGoodData?.additionalInfo.length !== 0 &&
            newGoodData?.variations.length !== 0
        ) {
            handleUpdateGood(newGoodData);
        }
    };
    
    return (
        <div className="update-good-form">
            <div className="field-mid-group">
                <div className="field">
                    <label className="label" htmlFor="update-good-name">Наименование</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, name: e.target.value })}
                        id="update-good-name"
                        placeholder="Наименование товара"
                        defaultValue={ isEdit ? newGoodData?.name : "" }
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-provider">Поставщик</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, provider: e.target.value })}
                        id="update-good-provider"
                        placeholder="Поставщик"
                        defaultValue={ isEdit ? newGoodData?.provider : "" }
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-category">Категория</label>
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
                    <label className="label" htmlFor="update-good-description">Описание</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, description: e.target.value })}
                        id="update-good-description"
                        placeholder="Описание товара"
                        defaultValue={ isEdit ? newGoodData?.description : "" }
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-full-description">Полное описание</label>
                    <TextField
                        onChange={(e) => setNewGoodData({ ...newGoodData, fullDescription: e.target.value })}
                        id="update-good-full-description"
                        placeholder="Полное описание"
                        defaultValue={ isEdit ? newGoodData?.fullDescription : "" }
                    />
                </div>
            </div>
            <div className="field-group">
                <div className="field">
                    <label className="label" htmlFor="update-good-images">Изображения товара</label>
                    <input
                        onChange={(e) => setNewGoodData({ ...newGoodData, images: e.target.files })}
                        type="file"
                        multiple 
                        className="file-input"
                        accept=".png, .jpg, .jpeg"
                    />
                </div>
                <div className="field">
                    <label className="label" htmlFor="update-good-video">Видео товара</label>
                    <input
                        onChange={(e) => setNewGoodData({ ...newGoodData, video: e.target.files })}
                        type="file" 
                        className="file-input"
                        accept=".mp4"
                    />
                </div>
            </div>
            <div className="field">
                <label className="label" >Характеристики (название, значение)</label>
                {
                    newGoodData?.additionalInfo.map((info, index) => {
                        return (
                            <div className="field-column">
                                <TextField
                                    defaultValue={info.name}
                                    placeholder="Название"
                                    onChange={(el) => {
                                        handleUpdateAdditionalData({ ...info, name: el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.description}
                                    placeholder="Значение"
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
                <label className="label" htmlFor="update-good-variations-info">Вариации (заголовок, значение, цена, остаток)</label>
                {
                    newGoodData?.variations.map((info, index) => {
                        return (
                            <div className="field-column">
                                <TextField
                                    defaultValue={info.name}
                                    placeholder="Название"
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, name: el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.title}
                                    placeholder="Значение"
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, title: el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.price}
                                    placeholder="Цена"
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, price: +el.target.value }, index);
                                    }}
                                />
                                <TextField
                                    defaultValue={info.stock}
                                    placeholder="Остаток"
                                    onChange={(el) => {
                                        handleUpdateVariationData({ ...info, stock: +el.target.value }, index);
                                    }}
                                />
                                { index === newGoodData.variations.length - 1 
                                    ? <AddBoxIcon onClick={handleAddVariation} /> : <div className="hide-add"></div>
                                }
                                <BackspaceIcon
                                    onClick={() => handleDeleteVariationData(index)}
                                />
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
