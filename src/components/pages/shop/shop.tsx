import { useEffect, useState } from 'react';
import { useTranslation } from '../../../translation/i18n';
import { IProduct } from '../../../models/products/products';
import { useNavigate, useParams } from 'react-router';
import { useProducts } from '../../../models/products/use-products';
import { useCategories } from '../../../models/categories/use-categories';
import { ICategory } from '../../../models/categories/categories';
import { useDiscounts } from '../../../models/discounts/use-discounts';
import DiscounstList from './discounts-list/discounts-list';
import FiltersList from './filters-list/filters-list';
import MediaCard from './card/card';
import './shop.scss';

export default function ShopPage () {

    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    
    const [currentSubCategories, setCurrentSubCategories] = useState<ICategory[]>([]);

    const { 
        filteredProducts, 
        handleFilterProductsByChildrenCategories 
    } = useProducts(params.id);

    const { categories, handleFindCategory } = useCategories();
    const { 
        discounts, 
        handleGetCountOfProductsForDiscount,
        handleGetBestDiscountForProductById
    } = useDiscounts();

    const handleGoToSubCategory = (category: ICategory) => {
        navigate(`/shop/${category.id}`);
    };

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
                    handleGetCountOfProductsForDiscount={ handleGetCountOfProductsForDiscount }
                />
                <FiltersList />
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
                <div className="products-count">
                    { filteredProducts.length !== 0 
                        ? <span>{ t("text.foundGoods") }: { filteredProducts.length }</span>
                        : <span>{ t("text.noGoods") }</span>
                    }
                </div>
                <div className="shop-content">
                    {
                        filteredProducts!.map((product: IProduct) => {
                            const bestDiscount = handleGetBestDiscountForProductById(product);
                            return <MediaCard key={ product.id } product = { product } bestDiscount={ bestDiscount } />;
                        })
                    }
                </div>
            </div>
        </div>
    );
}