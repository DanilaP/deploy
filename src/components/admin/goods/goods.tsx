import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ManageGoodForm } from "./forms/ManageGood/ManageGood";
import { IProduct } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router";
import CustomModal from "../../../components-ui/custom-modal/custom-modal";
import $api from '../../../configs/axiosconfig/axios.js';
import { IoMdSearch } from "react-icons/io";
import "./goods.scss";
import { useCategoryHelper } from "../../../helpers/use-category-helper.js";

export const GoodsPage = () => {

    const { t } = useTranslation();
    const [modals, setModals] = useState({ manage: false, delete: false, unsaved: false });
    const [currentMode, setCurrentMode] = useState<"create" | "edit" | null>(null);
    const [currentProducts, setCurrentProducts] = useState<IProduct[]>([]);
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [unSavedDataExist, setUnsavedDataExist] = useState<boolean>(false);
    const [currentActiveFilter, setCurrentActiveFilter] = useState<boolean>(true);
    const { categoriesForSelect } = useCategoryHelper();
    const navigate = useNavigate();

    const handleOpenCreatingGoodModal = () => {
        setModals(prev => {
            return { ...prev, manage: true };
        });
        setCurrentMode("create");
    };

    const handleOpenEditingGoodModal = (product: IProduct) => {
        setModals(prev => {
            return { ...prev, manage: true };
        });
        setCurrentProduct(product);
        setCurrentMode("edit");
    };

    const handleOpenDeleteGoodModal = (product: IProduct) => {
        setCurrentProduct(product);
        setModals(prev => {
            return { ...prev, delete: true };
        });
    };

    const handleApproveDeletingGood = () => {
        const updatedProducts = currentProducts.map(el => {
            if (el.id === currentProduct?.id) {
                return { ...el, active: false };
            }
            return el;
        });
        setCurrentProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        setModals(prev => {
            return { ...prev, delete: false };
        });
        setCurrentProduct(null);
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
        formData.append('price', JSON.stringify(goodData.price));
        formData.append('active', JSON.stringify(goodData.active));
        formData.append('published', JSON.stringify(goodData.published));
        
        for (let i = 0; i < goodData.images.length; i++) {
            formData.append('images', goodData.images[i]);
        }
        if (goodData.id) {
            formData.append('id', JSON.stringify(goodData.id));
        }
        const response = $api.post("/product", formData);
        response.then((res: any) => {
            if (res.data) {
                let updatedProducts = [];
                if (goodData.id) {               
                    updatedProducts = currentProducts.map(el => {
                        if (el.id === goodData.id) {
                            return { ...goodData, images: goodData.images };
                        }
                        return el;
                    }); 
                } else {  
                    updatedProducts = [...currentProducts, { 
                        ...goodData, 
                        id: Date.now(),
                        images: goodData.images
                    }];
                }
                setFilteredProducts(updatedProducts);
                setCurrentProducts(updatedProducts);
                setCurrentProduct(null);
                setModals(prev => {
                    return { ...prev, manage: false };
                });
                setUnsavedDataExist(false);
            }
        });
    };

    const handleSearchProduct = (inputValue: string) => {
        if (inputValue.length <= import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH && inputValue.length !== 0) return;
        const searchValue = inputValue.toLowerCase();
        setFilteredProducts(currentProducts.filter(el => {
            return el.name.toLowerCase().includes(searchValue) ||
                el.description.toLowerCase().includes(searchValue) ||
                el.fullDescription.toLowerCase().includes(searchValue) ||
                el.partNumber.includes(searchValue) ||
                String(el.variations[0].price).includes(searchValue);
        }));
    };

    const handleSearchProductByProvider = (inputValue: string) => {
        if (inputValue.length <= import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH && inputValue.length !== 0) return;
        const searchValue = inputValue.toLowerCase();
        setFilteredProducts(currentProducts.filter(el => el.provider.toLowerCase().includes(searchValue)));
    };

    const handleCancelUpdating = (status: boolean) => {
        if (status) {
            setModals(prev => {
                return { ...prev, unsaved: true };
            });
            return;
        } else {
            setModals(prev => {
                return { ...prev, manage: false, unsaved: false };
            });
            setCurrentProduct(null);
            setUnsavedDataExist(false);
        }
    };

    const handleGotoProductPage = (product: IProduct) => {
        navigate(`/shop/product/${product.id}`);
    };

    const handleFilterProductsByActive = (active: boolean) => {
        setCurrentActiveFilter(active);
        setFilteredProducts(currentProducts.filter(el => el.active === active));
    };

    const handleCloseUnsavedData = () => {
        setModals(prev => {
            return { ...prev, unsaved: false };
        });
    };

    const handleGetTitleForManagingGoodsModal = () => {
        let title: string = "";
        currentMode === "create" 
            ? title += t("text.createGoods")
            : title += t("text.editGood");
        currentProduct?.published 
            ? title += ` (${t("text.published")})`
            : title += ` (${t("text.unPublished")})`;
        return title;
    };

    const handleUnsavedDataExist = (status: boolean) => {
        setUnsavedDataExist(status);
    };

    useEffect(() => {
        handleFilterProductsByActive(currentActiveFilter);
    }, [currentProducts]);

    useEffect(() => {
        const response = $api.get("/products");
        response.then((res: any) => {
            if (res.data.products) {
                setCurrentProducts(res.data.products);
                setFilteredProducts(res.data.products);
            }
        });
    }, []);
    
    return (
        <div className="goods">
            <div className="title">{ t("text.managingGoods") }</div>
            <div className="goods-actions">
                <div className="filters">
                    <TextField
                        onChange={ (e) => handleSearchProduct(e.target.value) } 
                        placeholder={ t("text.searchAll") }
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                    <TextField 
                        onChange={ (e) => handleSearchProductByProvider(e.target.value) } 
                        placeholder={ t("text.provider") }
                        className="search-field"
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                    <Select
                        className="product-active-filter"
                        defaultValue={ 1 }
                        onChange={ (e) => handleFilterProductsByActive(Boolean(e.target.value)) }
                    >
                        <MenuItem value={ 1 }>{ t("text.active") }</MenuItem>
                        <MenuItem value={ 0 }>{ t("text.inactive") }</MenuItem>
                    </Select>
                </div>
                <div className="buttons">
                    <Button
                        variant='contained'
                        onClick={ handleOpenCreatingGoodModal }
                    >{ t("text.createGoods") }</Button>
                </div>
            </div>
            <div className="list">
                {
                    filteredProducts.map(product => {
                        return (
                            <div 
                                className="wrapper" 
                                key={ product.id }
                            >
                                <div className="good-avatar" onClick={ () => handleOpenEditingGoodModal(product) } >
                                    <img 
                                        className="good-image" 
                                        src={ product.images[0] } 
                                        width="50px" 
                                        height="50px"
                                    />
                                </div>
                                <div className="good-info" onClick={ () => handleOpenEditingGoodModal(product) } >
                                    <div className="good-info-main">
                                        <div className="good-title">{ product.name }</div>
                                        <div className="good-price">
                                            { t("text.price") }:
                                            {
                                                product.variations.length === 0
                                                    ? product.price
                                                    : product.variations[0].price
                                            }
                                        </div>
                                        <div className="good-provider">{ product.provider }</div>
                                    </div>
                                    <div className="good-info-more">
                                        <div className="good-description">
                                            { t("text.description") }: { product.description }
                                        </div>
                                    </div>
                                </div>
                                <div className="good-actions">
                                    <Button
                                        variant='outlined'
                                        onClick={ () => handleGotoProductPage(product) }
                                    >{ t("text.goto") }</Button>
                                    <Button
                                        variant='outlined'
                                        onClick={ () => handleOpenEditingGoodModal(product) }
                                    >{ t("text.edit") }</Button>
                                    <Button
                                        variant='outlined'
                                        onClick={ () => handleOpenDeleteGoodModal(product) }
                                    >{ t("text.delete") }</Button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <CustomModal
                isHidden={ modals.unsaved }
                isDisplay={ modals.manage }
                title = { handleGetTitleForManagingGoodsModal() }
                typeOfActions='none'
                actionConfirmed={ () => handleCancelUpdating(unSavedDataExist) }
                closeModal={ () => handleCancelUpdating(unSavedDataExist) }
            >
                <ManageGoodForm 
                    handleUpdateGood={ handleUpdateGood }
                    handleCancelUpdating={ () => handleCancelUpdating(unSavedDataExist) }
                    handleUnsavedDataExist={ handleUnsavedDataExist }
                    mode={ currentMode }
                    categoriesForSelect={ categoriesForSelect }
                    goodData={ currentProduct }
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.delete }
                title={ t("text.deleteGoods") }
                typeOfActions='default'
                actionConfirmed={ handleApproveDeletingGood }
                closeModal={ () => setModals({ ...modals, delete: false }) }
            >
                <div className="delete-text">{ t("text.approveDeletingGood") }?</div>
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.unsaved }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ () => handleCancelUpdating(false) }
                closeModal={ handleCloseUnsavedData }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ () => handleCancelUpdating(false) }
                        >{ t("text.close") }</Button>
                        <Button
                            onClick={ handleCloseUnsavedData }
                            variant="contained"
                        >{ t("text.cancel") }</Button>
                    </>
                }
            >
                <div className="delete-text">{ t("text.unsavedChanges") }?</div>
            </CustomModal>
        </div>
    );
};