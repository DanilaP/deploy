import { useEffect, useState } from "react";
import { IProduct } from "./products";
import { createProduct, getProducts } from "./products-api";
import { useProviders } from "../providers/use-providers";
import { IProvider } from "../providers/providers";
import { useCategories } from "../categories/use-categories";
import { ICategory } from "../categories/categories";
import { getAverageEvaluation } from "../../helpers/product-page-helpers";
import { useDiscounts } from "../discounts/use-discounts";
import { IDiscount } from "../discounts/discounts";
import lodash from "lodash";

export const useProducts = (categoryId?: string) => {

    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

    const { 
        categories, 
        findAllChildCategories,
        handleFindCategory
    } = useCategories();
    const { handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount } = useDiscounts();
    const { providers } = useProviders();
    
    const handleDeleteGood = (currentProduct: IProduct) => {
        const updatedProducts = products.map(el => {
            if (el.id === currentProduct?.id) {
                return { ...el, active: false };
            }
            return el;
        });
        setProducts(updatedProducts);
    };
    
    const handleUpdateGood = (product: IProduct) => {
        const response = createProduct(product);
        let updatedProducts = [];
        response.then(res => {
            if (res.data) {
                if (product.id) {
                    updatedProducts = products.map(el => {
                        if (el.id === product.id) {
                            return { ...product, images: product.images };
                        }
                        return el;
                    }); 
                } else {
                    updatedProducts = [...products, { 
                        ...product, 
                        id: Date.now(),
                        images: product.images
                    }];
                }
                setFilteredProducts(updatedProducts);
                setProducts(updatedProducts);
            }
        });
    };

    const handleSearchProduct = (inputValue: string) => {
        if (inputValue.length <= import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH && inputValue.length !== 0) return;
        const searchValue = inputValue.toLowerCase();
        setFilteredProducts(products.filter(el => {
            return el.name.toLowerCase().includes(searchValue) ||
                el.description.toLowerCase().includes(searchValue) ||
                el.fullDescription.toLowerCase().includes(searchValue) ||
                el.partNumber.includes(searchValue) ||
                String(el.variations[0].price).includes(searchValue);
        }));
    };

    const handleSearchProductByProvider = (inputValue: string) => {
        if (inputValue.length === 0) {
            setFilteredProducts(products);
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
        setFilteredProducts(products.filter(el => findedProviders.includes(+el.provider)));
    };

    const handleSearchProductsByActive = (active: boolean) => {
        setFilteredProducts(products.filter(el => el.active === active));
    };

    const handleFilterProductsByChildrenCategories = (products: IProduct[], currentCategory: ICategory | null) => {
        if (currentCategory) {
            const childrenCategories = [
                ...findAllChildCategories(currentCategory),
                currentCategory.id
            ];
            return products.filter((el: any) => {
                const isCategoriesIntersect = lodash.intersection(childrenCategories, el.category).length !== 0;
                return isCategoriesIntersect;
            });
        }
        return products;
    };

    const handleGetSortedProductsByRating = () => {
        const sortedProducts = [...filteredProducts.sort((prev, current) => {
            const prevEvaulation = getAverageEvaluation(prev.reviews || []);
            const nextEvaulation = getAverageEvaluation(current.reviews || []);
            if (prevEvaulation < nextEvaulation) return -1;
            return 1;
        })];
        return sortedProducts;
    };

    const handleGetFiltersOptionsByAdditionalInfo = () => {
        return filteredProducts.reduce((prev: any, product: IProduct) => {
            product.additionalInfo.forEach(additionalInfo => {
                const optionValue = {
                    title: additionalInfo.name,
                    value: additionalInfo.description
                };
                if (prev[additionalInfo.systemKey]) {
                    const findedOption = prev[additionalInfo.systemKey].find(el => el.value === optionValue.value);
                    if (!findedOption) {
                        prev[additionalInfo.systemKey] = [...prev[additionalInfo.systemKey], optionValue];
                    }
                }
                else {
                    prev[additionalInfo.systemKey] = [optionValue];
                }
                return prev;
            });
            return prev;
        }, {});
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

    const handleGetFilteredProductsByAdditionalInfo = (additionalInfoValues: Record<string, string>) => {
        let filteredProductsList: IProduct[] = [];
        Object.keys(additionalInfoValues).map((systemKey: string) => {
            const value = additionalInfoValues[systemKey];
            filteredProductsList = filteredProducts.filter(product => {
                const findedAdditionalInfo = product.additionalInfo.find(el => el.systemKey === systemKey);
                return value === findedAdditionalInfo?.description;
            });
        });
        return filteredProductsList;
    };

    useEffect(() => {
        const response = getProducts();
            response.then(res => {
                if (res.data.products) {
                    let updatedProducts = res.data.products;
                    if (categoryId) {
                        const findedCategory = handleFindCategory(categoryId, categories);  
                        updatedProducts = handleFilterProductsByChildrenCategories(updatedProducts, findedCategory);
                    }
                    setProducts(updatedProducts);
                    setFilteredProducts(updatedProducts);
                }
            });
    }, [categories, categoryId]);

    return {
        products,
        categories,
        providers,
        filteredProducts,
        setFilteredProducts,
        handleDeleteGood,
        handleUpdateGood,
        handleSearchProduct,
        handleSearchProductByProvider,
        handleSearchProductsByActive,
        handleFilterProductsByChildrenCategories,
        handleGetSortedProductsByRating,
        handleGetCountOfProductsForDiscount,
        handleGetFiltersOptionsByAdditionalInfo,
        handleGetFilteredProductsByAdditionalInfo
    };
};
