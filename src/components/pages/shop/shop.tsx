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
import { IProduct } from '../../../models/products/products';
import { IAdditionalInfoFilterOptions } from '../../../interfaces/interfaces';
import ShopPageView from './shop-page-view/shop-page-view';

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
    const [additionalInfoValues, setAdditionalInfoValues] = useState<Record<string, string>>({});
    const [additionalInfoFilterOptions, setAdditionalInfoFilterOptions] = useState<IAdditionalInfoFilterOptions>({});
    const [currentFilteredProductList, setCurrentFilteredProductList] = useState<IProduct[]>([]);

    const {
        products,
        handleFilterProductsByChildrenCategories,
        handleGetSortedProductsByRating,
        handleGetFiltersOptionsByAdditionalInfo,
        handleGetCountOfProductsForDiscount,
        handleGetFilteredProductsByAdditionalInfo,
        handleGetSortedProductsByCurrentPrice
    } = useProducts(params.id);
    const { 
        categories, 
        handleFindCategory 
    } = useCategories();
    const { 
        discounts,
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
        let sortedProducts: IProduct[] = [];
        if (fieldName === "price") {
            sortedProducts = handleGetSortedProductsByCurrentPrice(currentFilteredProductList);
        }
        if (fieldName === "rating") {
            sortedProducts = handleGetSortedProductsByRating(currentFilteredProductList);
        }
        setCurrentFilteredProductList(() => [...sortedProducts]);
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

    const handleUpdateAdditionalInfoValues = (systemKey: string, value: string) => {
        setAdditionalInfoValues(prev => {
            return {
                ...prev,
                [systemKey]: value
            };
        });
    };

    const handleClearAdditionalInfoFilters = () => {
        setAdditionalInfoValues({});
    };

    useEffect(() => {
        let allowedProductsByAdditionalInfo: IProduct[] | null = null;
        if (Object.keys(additionalInfoValues).length !== 0) {
            allowedProductsByAdditionalInfo = handleGetFilteredProductsByAdditionalInfo(additionalInfoValues);
        }
        const filteredProductsList = products.filter(product => {
            const isCurrentPriceAvailable = 
                handleIsProductPriceBetweenMinMaxFilters(product);
            const isInStock = filters.inStock ? handleCheckProductInStock(product) : true;
            const byDiscount = selectedDiscount 
                ? handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount(product.category, selectedDiscount.categories)
                : true;
            const allowedByAdditionalInfo = 
                allowedProductsByAdditionalInfo
                    ? allowedProductsByAdditionalInfo.find(el => el.id === product.id)
                    : true;
            return isInStock && byDiscount && isCurrentPriceAvailable && allowedByAdditionalInfo;
        });
        setCurrentFilteredProductList(filteredProductsList);
    },  [products, filters, selectedDiscount, additionalInfoValues]);

    useEffect(() => {
        const findedCategory: ICategory | null = handleFindCategory(params.id || "", categories);
        if (findedCategory) {
            setCurrentSubCategories(findedCategory.categories || []);
        } else {
            setCurrentSubCategories(categories);
        }
        handleClearAdditionalInfoFilters();
        setAdditionalInfoFilterOptions(handleGetFiltersOptionsByAdditionalInfo());
    }, [params.id, categories, products]);

    useEffect(() => {
        document.title = t("titles.shopPage");
    }, []);
    
    return (
        <ShopPageView
            discounts={ discounts }
            selectedDiscount={ selectedDiscount }
            filters={ filters }
            currentSubCategories={ currentSubCategories }
            filteredProducts={ currentFilteredProductList }
            additionalInfoValues={ additionalInfoValues }
            additionalInfoFilterOptions={ additionalInfoFilterOptions }
            handleGoToSubCategory={ handleGoToSubCategory }
            handleGetCountOfProductsForDiscount={ handleGetCountOfProductsForDiscount }
            setSelectedDiscount={ setSelectedDiscount }
            handleUpdateFilters={ handleUpdateFilters }
            handleFilterProductsByChildrenCategories={ handleFilterProductsByChildrenCategories }
            handleSortProductList={ handleSortProductList }
            handleGetBestDiscountForProductById={ handleGetBestDiscountForProductById }
            handleUpdateAdditionalInfoValues={ handleUpdateAdditionalInfoValues }
            handleClearAdditionalInfoFilters={ handleClearAdditionalInfoFilters }
        />
    );
}