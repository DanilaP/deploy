import { useEffect, useState } from "react";
import { IDiscount } from "./discounts";
import { IProduct } from "../products/products";
import { useProducts } from "../products/use-products.js";
import { createDiscount, deleteDiscount, getDiscounts, updateDiscount } from "./discounts-api.js";
import { useCategories } from "../categories/use-categories.js";
import lodash from "lodash";

export const useDiscounts = () => {

    const [discounts, setDiscounts] = useState<IDiscount[]>([]);
    const discountTypesForSelect = [
        { id: "promo", label: "Промокод" },
        { id: "discount", label: "Скидка" }
    ];

    const { products } = useProducts();
    const { 
        categories, 
        findAllChildCategories,
        handleFindCategory
    } = useCategories();

    const fetchDiscountsData = async () => {
        const response = await getDiscounts();
        if (response.data.discounts) {
            setDiscounts(response.data.discounts);
        }
    };

    const handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount = (
        productCategories: string[],
        categoriesForDiscount: string[]
    ) => {
        if (categoriesForDiscount.length === 0) return true;
        let fullCategoriesForDiscount: string[] = [];
        categoriesForDiscount.forEach(el => {
            const foundCategory = handleFindCategory(el, categories);
            if (foundCategory) {
                fullCategoriesForDiscount = [
                    ...fullCategoriesForDiscount,
                    ...findAllChildCategories(foundCategory)
                ];
            }
        });
        return lodash.intersection(fullCategoriesForDiscount, productCategories).length !== 0;
    };

    const handleGetCountOfProductsForDiscount = (discount: IDiscount) => {
        if (discount.categories.length === 0) return products.length;
        return products.reduce((prev: number, product: IProduct) => {
            if (
                handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount(product.category, discount.categories)
            ) {
                return prev + 1;
            }
            return prev;
        }, 0);
    };

    const handleGetBestDiscountForProductById = (product: IProduct) => {
        let allowedPercentage: number[] = [];
        discounts.filter(el => el.type === "discount").forEach((discount) => {
            if (
                handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount(product.category, discount.categories) ||
                discount.categories.length === 0
            ) {
                allowedPercentage = [...allowedPercentage, discount.value];
            }
        });
        return allowedPercentage.length !== 0 ? Math.max(...allowedPercentage) : 0;
    };

    const handleCreateDiscount = (discount: IDiscount) => {
        createDiscount(discount).then(res => {
            if (res.data.discount) {
                setDiscounts(prev => {
                    return [...prev, { ...discount, id: Date.now() }];
                });
            }
        });
    };

    const handleUpdateDiscount = (newDiscountData: IDiscount) => {
        updateDiscount(newDiscountData).then(res => {
            if (res.data.discount) {
                setDiscounts(prev => {
                    return prev.map(el => {
                        if (el.id === newDiscountData.id) return newDiscountData;
                        return el;
                    });
                });
            }
        });
    };

    const handleDeleteDiscount = (discount: IDiscount) => {
        if (discount.id) {
            deleteDiscount(discount.id).then(res => {
                if (res.data.discount) {
                    setDiscounts(prev => prev.map(el => {
                        if (el.id === discount.id) {
                            return { ...el, active: false };
                        }
                        return el;
                    }));
                }
            });
        }
    };

    useEffect(() => {
        fetchDiscountsData();
    }, []);

    return {
        discounts,
        discountTypesForSelect,
        handleGetCountOfProductsForDiscount,
        handleGetBestDiscountForProductById,
        handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount,
        handleCreateDiscount,
        handleUpdateDiscount,
        handleDeleteDiscount
    };
};
