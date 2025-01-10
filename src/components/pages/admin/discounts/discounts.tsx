import { useState } from "react";
import { useDiscounts } from "../../../../models/discounts/use-discounts";
import { useCategories } from "../../../../models/categories/use-categories";
import { IDiscount } from "../../../../models/discounts/discounts";
import { useProducts } from "../../../../models/products/use-products";
import DiscountsPageView from "./components/discounts-page-view/discounts-page-view";

export default function DiscountsPage() {

    const { 
        discounts,
        discountTypesForSelect,
        handleCreateDiscount,
        handleDeleteDiscount,
        handleUpdateDiscount
    } = useDiscounts();
    const {
        handleGetCountOfProductsForDiscount
    } = useProducts();
    const {
        categoriesForSelect
    } = useCategories();

    const [currentDiscount, setCurrentDiscount] = useState<IDiscount | null>(null);
    const [modals, setModals] = useState<{ manage: boolean, confirmDeleting: boolean }>({ 
        manage: false, 
        confirmDeleting: false 
    });

    const handleOpenCreateDiscountModal = () => {
        setCurrentDiscount(null);
        setModals(prev => {
            return { ...prev, manage: true };
        });
    };

    const handleOpenEditDiscountModal = (discountId: number) => {
        const findedDiscount = discounts.find(discount => discount.id === discountId);
        if (findedDiscount) {
            setCurrentDiscount(findedDiscount);
            setModals(prev => {
                return { ...prev, manage: true };
            });
        }
    };

    const handleCloseManageDiscountModal = () => {
        setCurrentDiscount(null);
        setModals(prev => {
            return { ...prev, manage: false };
        });
    };

    const handleSaveDiscountData = (discountData: IDiscount) => {
        if (discountData.id) {
            handleUpdateDiscount(discountData);
        } else {
            handleCreateDiscount(discountData);
        }
        setModals(prev => {
            return { ...prev, manage: false };
        });
    };

    const handleOpenDeletingDiscountModal = (discountId: number) => {
        const findedDiscount = discounts.find(discount => discount.id === discountId);
        if (findedDiscount) {
            setCurrentDiscount(findedDiscount);
            setModals(prev => {
                return { ...prev, confirmDeleting: true };
            });
        }
    };

    const handleConfirmDeletingDiscount = () => {
        if (currentDiscount) {
            handleDeleteDiscount(currentDiscount);
            setModals(prev => {
                return { ...prev, confirmDeleting: false };
            });
        }
    };

    const handleCancelDeletingDiscount = () => {
        setCurrentDiscount(null);
        setModals(prev => {
            return { ...prev, confirmDeleting: false };
        });
    };

    return (
        <DiscountsPageView
            modals={ modals }
            currentDiscount={ currentDiscount }
            discounts={ discounts }
            categoriesForSelect={ categoriesForSelect }
            discountTypesForSelect={ discountTypesForSelect }
            handleSaveDiscountData={ handleSaveDiscountData }
            handleGetCountOfProductsForDiscount={ handleGetCountOfProductsForDiscount }
            handleCloseManageDiscountModal={ handleCloseManageDiscountModal }
            handleOpenEditDiscountModal={ handleOpenEditDiscountModal }
            handleOpenCreateDiscountModal={ handleOpenCreateDiscountModal }
            handleCancelDeletingDiscount={ handleCancelDeletingDiscount }
            handleConfirmDeletingDiscount={ handleConfirmDeletingDiscount }
            handleOpenDeletingDiscountModal={ handleOpenDeletingDiscountModal }
        />
    );
}