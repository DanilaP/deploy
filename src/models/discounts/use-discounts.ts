import { useEffect, useState } from "react";
import { IDiscount } from "./discounts";
import { IProduct } from "../products/products";
import { useProducts } from "../products/use-products.js";
import { getDiscounts } from "./discounts-api.js";

export const useDiscounts = () => {

    const [discounts, setDiscounts] = useState<IDiscount[]>([]);

    const { products } = useProducts();

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
        let status = false;
        productCategories.forEach(el => {
            if (categoriesForDiscount?.includes(el) || categoriesForDiscount === null) {
                status = true;
                return;
            }
        });
        return status;
    };

    const handleGetCountOfProductsForDiscount = (discount: IDiscount) => {
        if (discount.categories === null) return products.length;
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
        discounts.forEach((discount) => {
            if (
                handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount(product.category, discount.categories)
            ) {
                allowedPercentage = [...allowedPercentage, discount.percentage];
            }
        });
        return Math.max(...allowedPercentage);
    };

    useEffect(() => {
        fetchDiscountsData();
    }, []);

    return {
        discounts,
        handleGetCountOfProductsForDiscount,
        handleGetBestDiscountForProductById
    };
};
