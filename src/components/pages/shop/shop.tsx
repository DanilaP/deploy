import { useEffect, useState } from 'react';
import { useTranslation } from '../../../translation/i18n';
import { useNavigate, useParams } from 'react-router';
import { useProducts } from '../../../models/products/use-products';
import { useCategories } from '../../../models/categories/use-categories';
import { ICategory } from '../../../models/categories/categories';
import { useDiscounts } from '../../../models/discounts/use-discounts';
import { IDiscount } from '../../../models/discounts/discounts';
import { useWarehouse } from '../../../models/warehouse/use-warehouse';
import { IFilters } from './filters-list/filters-list';
import ShopPageView from './shop-page-view/shop-page-view';
import { IProduct } from '../../../models/products/products';

export default function ShopPage () {

    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    
    const [currentSubCategories, setCurrentSubCategories] = useState<ICategory[]>([]);
    const [selectedDiscount, setSelectedDiscount] = useState<IDiscount | null>(null);
    const [filters, setFilters] = useState<IFilters>({
        inStock: false,
        price: {
            min: 0,
            max: null
        }
    });
    
    const {
        products,
        filteredProducts,
        setFilteredProducts,
        handleFilterProductsByChildrenCategories,
        handleGetSortedProductsByRating,
    } = useProducts(params.id);
    const { 
        categories, 
        handleFindCategory 
    } = useCategories();
    const { 
        discounts, 
        handleGetCountOfProductsForDiscount,
        handleGetBestDiscountForProductById,
        handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount
    } = useDiscounts();
    const {
        handleCheckProductInStock
    } = useWarehouse();

    const handleGoToSubCategory = (category: ICategory) => {
        navigate(`/shop/${category.id}`);
    };

    const handleUpdateFilters = (filters: IFilters) => {
        setFilters(filters);
    };

    const handleSortProductList = (fieldName: string) => {
        let sortedProducts = filteredProducts;
        if (fieldName === "price") {
            sortedProducts = [...filteredProducts.sort((prev, current) => {
                const prevBestPrice = 
                    prev.price - prev.price * handleGetBestDiscountForProductById(prev) / 100;
                const prevNextPrice = 
                    current.price - current.price * handleGetBestDiscountForProductById(current) / 100;
                if (prevBestPrice < prevNextPrice) return -1;
                return 1;
            })];
        }
        if (fieldName === "rating") {
            sortedProducts = handleGetSortedProductsByRating();
        }
        setFilteredProducts(() => sortedProducts);
    };

    const handleIsProductPriceBetweenMinMaxFilters = (product: IProduct) => {
        let isBetweenMinMaxPrice = true;
        const currentPrice = 
            product.price - product.price * handleGetBestDiscountForProductById(product) / 100;
        if (filters.price.max) {
            isBetweenMinMaxPrice = isBetweenMinMaxPrice && currentPrice <= filters.price.max;
        }
        if (filters.price.min) {
            isBetweenMinMaxPrice = isBetweenMinMaxPrice && currentPrice >= filters.price.min;
        }
        return isBetweenMinMaxPrice;
    };

    useEffect(() => {
        const filteredProductsList = products.filter(product => {
            const isCurrentPriceAvailable = 
                handleIsProductPriceBetweenMinMaxFilters(product);
            const isInStock = filters.inStock ? handleCheckProductInStock(product) : true;
            const byDiscount = selectedDiscount 
                ? handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount(product.category, selectedDiscount.categories)
                : true;
            return isInStock && byDiscount && isCurrentPriceAvailable;
        });
        setFilteredProducts(filteredProductsList);
    },  [filters, selectedDiscount, products]);

    useEffect(() => {
        const findedCategory: ICategory | null = handleFindCategory(params.id || "", categories);
        if (findedCategory) {
            setCurrentSubCategories(findedCategory.categories || []);
        } else {
            setCurrentSubCategories(categories);
        }
    }, [params.id, categories]);

    useEffect(() => {
        document.title = t("titles.shopPage");
    }, []);

    return (
        <ShopPageView
            discounts={ discounts }
            selectedDiscount={ selectedDiscount }
            filters={ filters }
            currentSubCategories={ currentSubCategories }
            filteredProducts={ filteredProducts }
            handleGoToSubCategory={ handleGoToSubCategory }
            handleGetCountOfProductsForDiscount={ handleGetCountOfProductsForDiscount }
            setSelectedDiscount={ setSelectedDiscount }
            handleUpdateFilters={ handleUpdateFilters }
            handleFilterProductsByChildrenCategories={ handleFilterProductsByChildrenCategories }
            handleSortProductList={ handleSortProductList }
            handleGetBestDiscountForProductById={ handleGetBestDiscountForProductById }
        />
    );
}