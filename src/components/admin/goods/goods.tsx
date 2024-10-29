import { Button, TextField } from "@mui/material";
import "./goods.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import CustomModal from "../../../components-ui/custom-modal/custom-modal";
import { ManageGoodForm } from "./forms/ManageGood/ManageGood";
import { IProduct } from "../../../interfaces/interfaces";
import $api from '../../../configs/axiosconfig/axios.js';

export const GoodsPage = () => {

    const { t } = useTranslation();
    const [modals, setModals] = useState({ edit: false, create: false, delete: false });
    const [currentMode, setCurrentMode] = useState<"create" | "edit" | null>(null);
    const [currentProducts, setCurrentProducts] = useState<IProduct[]>([]);
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

    const handleOpenCreatingGoodModal = () => {
        setModals(prev => {
            return { ...prev, create: true };
        });
        setCurrentMode("create");
    };

    const handleOpenEditingGoodModal = (product: IProduct) => {
        setModals(prev => {
            return { ...prev, create: true };
        });
        setCurrentProduct(product);
        setCurrentMode("edit");
    };

    const handleOpenDeleteGoodModal = (product: IProduct) => {
        const updatedProducts = currentProducts.filter(el => el.id !== product.id);
        setCurrentProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setModals(prev => {
            return { ...prev, delete: true };
        });
    };

    const handleUpdateGood = (goodData: IProduct) => {
        const formData = new FormData();
        formData.append('additionalInfo', JSON.stringify(goodData.additionalInfo));
        formData.append('category', JSON.stringify(goodData.category));
        formData.append('description', JSON.stringify(goodData.description));
        formData.append('fullDescription', JSON.stringify(goodData.fullDescription));
        formData.append('name', JSON.stringify(goodData.name));
        formData.append('provider', JSON.stringify(goodData.provider));
        formData.append('reviews', JSON.stringify(goodData.reviews));
        formData.append('variations', JSON.stringify(goodData.variations));
        formData.append('video', goodData.video[0]);

        for (let i = 0; i < goodData.images.length; i++) {
            formData.append('images', goodData.images[i]);
        }
        if (goodData.id) {
            formData.append('id', JSON.stringify(goodData.id));
        }
        const response = $api.post("/product", formData);
        response.then(res => {
            if (res.data) {
                setCurrentProduct(null);
                setModals(prev => {
                    return { ...prev, create: false };
                });
                const updatedProducts = currentProducts.map(el => {
                    if (el.id === goodData.id) {
                        return goodData;
                    }
                    return el;
                });
                setFilteredProducts(updatedProducts);
                setCurrentProducts(updatedProducts);
            }
        });
    };

    const handleSearchProduct = (searchValue: string) => {
        setFilteredProducts(currentProducts.filter(el => el.name.includes(searchValue)));
    };

    const handleCancelUpdating = () => {
        setCurrentProduct(null);
        setModals(prev => {
            return { ...prev, create: false };
        });
    };

    useEffect(() => {
        const response = $api.get("/products");
        response.then(res => {
            if (res.data.products) {
                setCurrentProducts(res.data.products);
                setFilteredProducts(res.data.products);
            }
        });
    }, []);

    return (
        <div className="goods">
            <div className="title">Управление товарами</div>
            <div className="actions">
                <TextField 
                    onChange={ (e) => handleSearchProduct(e.target.value) } 
                    placeholder="Наименование товара"
                    className="search-field"
                />
                <Button
                    variant='contained'
                    onClick={handleOpenCreatingGoodModal}
                >{ t("text.createGoods") }</Button>
            </div>
            <div className="list">
                {
                    filteredProducts.map(product => {
                        return (
                            <div className="wrapper" key={product.id}>
                                <div className="good-info">
                                    <img src={product.images[0]} width="50px" height="50px" />
                                    <div className="good-title">Товар: {product.name}</div>
                                    <div className="good-price">Вариации: {product.variations.length}</div>
                                    <div className="good-stock">Поставщик: {product.provider}</div>
                                </div>
                                <div className="good-actions">
                                    <Button
                                        variant='contained'
                                        onClick={() => handleOpenEditingGoodModal(product)}
                                    >{ t("text.edit") }</Button>
                                    <Button
                                        variant='contained'
                                        onClick={() => handleOpenDeleteGoodModal(product)}
                                    >{ t("text.delete") }</Button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <CustomModal 
                isDisplay={ modals.create }
                title = { currentMode === 'create' ? t("text.createGoods") : t("text.editGood") }
                typeOfActions='none'
                closeModal={ () => setModals({ ...modals, create: false }) }
            >
                <ManageGoodForm 
                    handleUpdateGood={handleUpdateGood}
                    handleCancelUpdating={handleCancelUpdating}
                    mode={currentMode}
                    goodData={currentProduct}
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.delete }
                title = { t("text.deleteGoods") }
                typeOfActions='default'
                actionConfirmed={ () => setModals({ ...modals, delete: false }) }
                closeModal={ () => setModals({ ...modals, delete: false }) }
            >
                Подтвердить удаление товара?
            </CustomModal>
        </div>
    );
};