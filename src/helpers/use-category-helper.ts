import { useEffect, useState } from "react";
import { ICategory } from "../interfaces/interfaces";
import $api from "../configs/axiosconfig/axios.js";

export const useCategoryHelper = () => {

    const [categorys, setCategorys] = useState<ICategory[]>([]);

    const handleDeleteSubCategory = (categoryList: ICategory[], category: ICategory) => {
        const updatedCategory = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === category.id) {
                return prev;
            }
            if (item.categorys) {
                const filteredCategorys: ICategory[] = handleDeleteSubCategory(item.categorys, category);
                return [...prev, { ...item, categorys: filteredCategorys }];
            }
            return [...prev, item];
        }, []);
        setCategorys(updatedCategory);
        return updatedCategory;
    };

    const handleFindCategoryAndAddIntoNewCategory = (
        currentCategory: ICategory, 
        newCategoryTitle: string, 
        categoryList: ICategory[]
    ) => {
        const updatedCategory = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === currentCategory.id) {
                return [...prev, {
                    ...item,
                    categorys: item.categorys 
                        ? [...item.categorys, { id: String(Date.now()), title: newCategoryTitle }]
                        : [{ id: String(Date.now()), title: newCategoryTitle }]
                }];
            }
            if (item.categorys) {
                const updated: ICategory[] = 
                    handleFindCategoryAndAddIntoNewCategory(currentCategory, newCategoryTitle, item.categorys);
                return [...prev, { ...item, categorys: updated }];
            }
            return [...prev, item];
        }, []);
        return updatedCategory;
    };

    useEffect(() => {
        $api.get("/category").then(res => {
            if (res.data) {
                setCategorys(res.data.categoryList);
            }
        });
    }, []);

    return { categorys, setCategorys, handleDeleteSubCategory, handleFindCategoryAndAddIntoNewCategory };
};