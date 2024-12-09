import { useState } from "react";
import { useDiscounts } from "../../../../models/discounts/use-discounts";
import { useCategories } from "../../../../models/categories/use-categories";
import { IDiscount } from "../../../../models/discounts/discounts";
import DiscountsPageView from "./components/discounts-page-view/discounts-page-view";

export default function DiscountsPage() {

    const { 
        discounts,
        handleGetCountOfProductsForDiscount,
    } = useDiscounts();

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
            console.log('edit', discountData);
        } else {
            console.log('create', discountData);
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
        console.log('delete', currentDiscount);
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