import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCategories } from "../../../../models/categories/use-categories.js";
import { useProviders } from "../../../../models/providers/use-providers.js";
import { IProduct } from "../../../../models/products/products.js";
import { useProducts } from "../../../../models/products/use-products.js";
import GoodsPageView from "./components/goods-page-view/goods-page-view.js";

export const GoodsPage = () => {

    const { t } = useTranslation();
    const [modals, setModals] = useState({ manage: false, delete: false, unsaved: false });
    const [currentMode, setCurrentMode] = useState<"create" | "edit" | "createFromCopy" | null>(null);
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
    const [unSavedDataExist, setUnsavedDataExist] = useState<boolean>(false);
    const [currentActiveFilter, setCurrentActiveFilter] = useState<boolean>(true);

    const { categoriesForSelect } = useCategories();
    const { providersForSelect, providers } = useProviders();
    const navigate = useNavigate();
    
    const { 
        products: currentProducts, 
        filteredProducts,
        handleDeleteGood,
        handleSearchProduct,
        handleSearchProductByProvider,
        handleUpdateGood,
        handleSearchProductsByActive
    } = useProducts();

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
        if (currentProduct) {
            handleDeleteGood(currentProduct);
            setModals(prev => {
                return { ...prev, delete: false };
            });
            setCurrentProduct(null);
        }
    };

    const handleApproveUpdatingGood = (goodData: IProduct) => {
        handleUpdateGood(goodData);
        setCurrentProduct(null);
        setModals(prev => {
            return { ...prev, manage: false };
        });
        setUnsavedDataExist(false);
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
        handleSearchProductsByActive(active);
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
            handleUpdateGood={ handleApproveUpdatingGood }
        />
    );
};