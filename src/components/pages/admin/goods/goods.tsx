import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCategories } from "../../../../models/categories/use-categories.js";
import { useProviders } from "../../../../models/providers/use-providers.js";
import { createProduct, getProducts } from "../../../../models/products/products-api.js";
import { IProvider } from "../../../../models/providers/providers.js";
import { IProduct } from "../../../../models/products/products.js";
import GoodsPageView from "./components/goods-page-view/goods-page-view.js";

export const GoodsPage = () => {

    const { t } = useTranslation();
    const [modals, setModals] = useState({ manage: false, delete: false, unsaved: false });
    const [currentMode, setCurrentMode] = useState<"create" | "edit" | "createFromCopy" | null>(null);
    const [currentProducts, setCurrentProducts] = useState<IProduct[]>([]);
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [unSavedDataExist, setUnsavedDataExist] = useState<boolean>(false);
    const [currentActiveFilter, setCurrentActiveFilter] = useState<boolean>(true);
    const { categoriesForSelect } = useCategories();
    const navigate = useNavigate();
    const { providersForSelect, providers } = useProviders();
    
    const handleOpenCreatingGoodModal = () => {
        setModals(prev => {
            return { ...prev, manage: true };
        });
        setCurrentMode("create");
    };

    const handleOpenCreatingFromCopyGoodModal = (product: IProduct) => {
        setModals(prev => {
            return { ...prev, manage: true };
        });
        setCurrentProduct(product);
        setCurrentMode("createFromCopy");
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

    const handleCloseDeleteGoodModal = () => {
        setCurrentProduct(null);
        setModals(prev => {
            return { ...prev, delete: false };
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
        const response = createProduct(goodData);
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
        if (inputValue.length === 0) {
            setFilteredProducts(currentProducts);
            return;
        } 
        if (inputValue.length <= import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH) return;
        const searchValue = inputValue.toLowerCase();
        const findedProviders = providers.reduce((prev: number[], provider: IProvider): number[] => {
            if (provider.name.toLowerCase().includes(searchValue) && provider.id) {
                return [...prev, provider.id];
            }
            return prev;
        }, []);
        setFilteredProducts(currentProducts.filter(el => findedProviders.includes(+el.provider)));
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
        const response = getProducts();
        response.then((res: any) => {
            if (res.data.products) {
                setCurrentProducts(res.data.products);
                setFilteredProducts(res.data.products);
            }
        });
    }, []);
    
    return (
        <GoodsPageView
            modals={ modals }
            currentMode={ currentMode }
            filteredProducts={ filteredProducts }
            categoriesForSelect={ categoriesForSelect }
            providersForSelect={ providersForSelect }
            providers={ providers }
            currentProduct={ currentProduct }
            unSavedDataExist={ unSavedDataExist }
            handleApproveDeletingGood={ handleApproveDeletingGood }
            handleCancelUpdating={ handleCancelUpdating }
            handleCloseDeleteGoodModal={ handleCloseDeleteGoodModal }
            handleCloseUnsavedData={ handleCloseUnsavedData }
            handleFilterProductsByActive={ handleFilterProductsByActive }
            handleGetTitleForManagingGoodsModal={ handleGetTitleForManagingGoodsModal }
            handleGotoProductPage={ handleGotoProductPage }
            handleOpenCreatingFromCopyGoodModal={ handleOpenCreatingFromCopyGoodModal }
            handleOpenCreatingGoodModal={ handleOpenCreatingGoodModal }
            handleOpenDeleteGoodModal={ handleOpenDeleteGoodModal }
            handleOpenEditingGoodModal={ handleOpenEditingGoodModal }
            handleSearchProduct={ handleSearchProduct }
            handleSearchProductByProvider={ handleSearchProductByProvider }
            handleUnsavedDataExist={ handleUnsavedDataExist }
            handleUpdateGood={ handleUpdateGood }
        />
    );
};