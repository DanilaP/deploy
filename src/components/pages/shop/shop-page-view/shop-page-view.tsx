import { MenuItem, Select } from "@mui/material";
import { IDiscount } from "../../../../models/discounts/discounts";
import { ICategory } from "../../../../models/categories/categories";
import { IProduct } from "../../../../models/products/products";
import { useTranslation } from "react-i18next";
import DiscounstList from "../discounts-list/discounts-list";
import FiltersList, { IFilters } from "../filters-list/filters-list";
import MediaCard from "../card/card";
import "./shop-page-view.scss";
import CategoryCard from "../category-card/category-card";
import AdditionalInfoFilters from "../additional-info-filters/additional-info-filters";

interface IShopPageViewProps {
    discounts: IDiscount[],
    selectedDiscount: IDiscount | null,
    filters: IFilters,
    currentSubCategories: ICategory[],
    filteredProducts: IProduct[],
    additionalInfoValues: Record<string, string>,
    handleGoToSubCategory: (category: ICategory) => void,
    handleGetCountOfProductsForDiscount: (discount: IDiscount) => number,
    setSelectedDiscount: (discount: IDiscount | null) => void,
    handleUpdateFilters: (filters: IFilters) => void,
    handleFilterProductsByChildrenCategories: (filteredProducts: IProduct[], category: ICategory) => IProduct[],
    handleSortProductList: (field: string) => void,
    handleGetBestDiscountForProductById: (product: IProduct) => number,
    handleGetFiltersOptionsByAdditionalInfo: () => Record<string, { title: string, value: any }[]>
    handleUpdateAdditionalInfoValues: (systemKey: string, value: string) => void,
    handleClearAdditionalInfoFilters: () => void
}

export default function ShopPageView({
    discounts,
    selectedDiscount,
    filters,
    currentSubCategories,
    filteredProducts,
    additionalInfoValues,
    handleGoToSubCategory,
    handleGetCountOfProductsForDiscount,
    setSelectedDiscount,
    handleUpdateFilters,
    handleFilterProductsByChildrenCategories,
    handleSortProductList,
    handleGetBestDiscountForProductById,
    handleGetFiltersOptionsByAdditionalInfo,
    handleUpdateAdditionalInfoValues,
    handleClearAdditionalInfoFilters
}: IShopPageViewProps) {
    
    const { t } = useTranslation();
    const additionalInfoFilterOptions = handleGetFiltersOptionsByAdditionalInfo();

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
                <AdditionalInfoFilters
                    additionalInfoFilterOptions={ additionalInfoFilterOptions }
                    additionalInfoValues={ additionalInfoValues }
                    handleUpdateAdditionalInfoValues={ handleUpdateAdditionalInfoValues }
                    handleClearAdditionalInfoFilters={ handleClearAdditionalInfoFilters }
                />
                <div className="categories-list">
                    {
                        currentSubCategories.map(category => {
                            const productsInCategory = handleFilterProductsByChildrenCategories(filteredProducts, category);
                            return (
                                <CategoryCard
                                    key={ category.id }
                                    category={ category }
                                    productsInCategory={ productsInCategory }
                                    handleGoToSubCategory={ handleGoToSubCategory }
                                />
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