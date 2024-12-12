import { useEffect, useState } from "react";
import { IProduct } from "./products";
import { createProduct, getProducts } from "./products-api";
import { useProviders } from "../providers/use-providers";
import { IProvider } from "../providers/providers";
import { useCategories } from "../categories/use-categories";
import { ICategory } from "../categories/categories";
import lodash from "lodash";

export const useProducts = (categoryId?: string) => {

    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

    const { 
        categories, 
        findAllChildCategories,
        handleFindCategory
    } = useCategories();
    
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
        handleDeleteGood,
        handleUpdateGood,
        handleSearchProduct,
        handleSearchProductByProvider,
        handleSearchProductsByActive,
        handleFilterProductsByChildrenCategories
    };
};
