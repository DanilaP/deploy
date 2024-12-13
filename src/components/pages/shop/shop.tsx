import { useEffect, useState } from 'react';
import { useTranslation } from '../../../translation/i18n';
import { IProduct } from '../../../models/products/products';
import { useNavigate, useParams } from 'react-router';
import { useProducts } from '../../../models/products/use-products';
import { useCategories } from '../../../models/categories/use-categories';
import { ICategory } from '../../../models/categories/categories';
import { useDiscounts } from '../../../models/discounts/use-discounts';
import { MenuItem, Select } from '@mui/material';
import { IDiscount } from '../../../models/discounts/discounts';
import DiscounstList from './discounts-list/discounts-list';
import FiltersList, { IFilters } from './filters-list/filters-list';
import MediaCard from './card/card';
import './shop.scss';
import { useWarehouse } from '../../../models/warehouse/use-warehouse';

export default function ShopPage () {

    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    
    const [currentSubCategories, setCurrentSubCategories] = useState<ICategory[]>([]);
    const [filters, setFilters] = useState<IFilters>({
        inStock: true
    });
    const [selectedDiscount, setSelectedDiscount] = useState<IDiscount | null>(null);

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
        warehouses,
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

    useEffect(() => {
        const filteredProductsList = products.filter(product => {
            const isInStock = filters.inStock ? handleCheckProductInStock(product) : true;
            const byDiscount = selectedDiscount 
                ? handleCheckProductsCategoriesAreCrossWithCategoriesForDiscount(product.category, selectedDiscount.categories)
                : true;
            return isInStock && byDiscount;
        });
        setFilteredProducts(filteredProductsList);
    },  [filters, selectedDiscount]);

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
        <div className='shop-wrapper'>
            <div className="shop-left-menu">
                <DiscounstList
                    discounts={ discounts }
                    selectedDiscount={ selectedDiscount }
                    handleGetCountOfProductsForDiscount={ handleGetCountOfProductsForDiscount }
                    handleUpdateSelectedDiscount={ setSelectedDiscount }
                />
                <FiltersList
                    filters={ filters }
                    handleUpdateFilters={ handleUpdateFilters }
                />
            </div>
            <div className="shop-products-wrapper">
                <div className="categories-list">
                    {
                        currentSubCategories.map(category => {
                            const countOfProductsInCategory = handleFilterProductsByChildrenCategories(filteredProducts, category);
                            return (
                                <div 
                                    key={ category.id } 
                                    className="category-wrapper"
                                    onClick={ () => handleGoToSubCategory(category) }
                                >
                                    <div className="category-title">
                                        { category.title } ({ countOfProductsInCategory.length })
                                    </div>
                                    <img
                                        src={ category.image } 
                                        alt={ category.description } 
                                        className="category-image" 
                                    />
                                </div>
                            );
                        })
                    }
                </div>
                
                <div className="shop-content-menu">
                    <div className="products-count">
                        { filteredProducts.length !== 0 
                            ? <span>{ t("text.foundGoods") }: { filteredProducts.length }</span>
                            : <span>{ t("text.noGoods") }</span>
                        }
                    </div>
                    <Select
                        defaultValue={ "price" }
                        onChange={ (e) => handleSortProductList(e.target.value) }
                    >
                        <MenuItem value={ "price" }>{ t("text.filtersList.price") }</MenuItem>
                        <MenuItem value={ "rating" }>{ t("text.filtersList.rating") }</MenuItem>
                    </Select>
                </div>
                <div className="shop-content">
                    {
                        filteredProducts.map((product: IProduct) => {
                            const bestDiscount = handleGetBestDiscountForProductById(product);
                            return (
                                <MediaCard
                                    key={ product.id }
                                    product={ product }
                                    bestDiscount={ bestDiscount }
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}