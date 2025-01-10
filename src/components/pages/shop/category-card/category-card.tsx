import { useState } from "react";
import { ICategory } from "../../../../models/categories/categories";
import { IProduct } from "../../../../models/products/products";
import "./category-card.scss";
import { Link } from "react-router-dom";

interface ICategoryCardProps {
    category: ICategory,
    productsInCategory: IProduct[],
    handleGoToSubCategory: (category: ICategory) => void,
}

export default function CategoryCard({
    category,
    productsInCategory,
    handleGoToSubCategory
}: ICategoryCardProps) {

    const [isSubCategoriesShown, setIsSubCategoriesShown] = useState<boolean>(false);

    const handleGoToChildSubCategory = (e: any, category: ICategory) => {
        e.stopPropagation();
        handleGoToSubCategory(category);
    };

    return (
        <div 
            key={ category.id }
            onMouseEnter={ () => setIsSubCategoriesShown(true) }
            onMouseLeave={ () => setIsSubCategoriesShown(false) }
            className="category-wrapper"
            onClick={ () => handleGoToSubCategory(category) }
        >
            {
                !category.categories || !isSubCategoriesShown
                ? 
                <>
                    <div className="category-title">
                        { category.title } ({ productsInCategory.length })
                    </div>
                    <img
                        src={ category.image } 
                        alt={ category.description } 
                        className="category-image" 
                    />
                </>
                : 
                <>
                    <div className="category-title">
                        { category.title } ({ productsInCategory.length })
                    </div>
                    <div className="sub-categories-list">
                        {
                            category.categories?.map(el => {
                                return (
                                    <div
                                        onClick={ (e) => handleGoToChildSubCategory(e, el) }
                                        key={ el.id }
                                        className="sub-category-wrapper"
                                    >
                                        { el.title }
                                    </div>
                                );
                            })
                        }
                    </div>
                </>
            }
        </div>
    );
}