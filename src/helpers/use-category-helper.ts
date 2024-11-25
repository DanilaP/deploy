import { useEffect, useState } from "react";
import { ICategory, ISelect } from "../interfaces/interfaces.js";
import $api from "../configs/axiosconfig/axios.js";

export const useCategoryHelper = () => {

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [categoriesForSelect, setCategoriesForSelect] = useState<ISelect[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);

    const handleGetCategoriesDataForSelect = (categoryList: ICategory[]): ISelect[] => {
        const categoriesForSelect = categoryList.reduce((prev: ISelect[], item: ICategory) => {
            const subCategoriesForSelect = handleGetCategoriesDataForSelect(item.categories || []);
            return [...prev, { id: item.id, label: item.title }, ...subCategoriesForSelect];
        }, []);
        setCategoriesForSelect(categoriesForSelect);
        return categoriesForSelect;
    };

    const handleAddRootCategory = (categoryTitle: string) => {
        const isCategoryExist = handleCheckIsCategoryExist(categoryTitle, categories).length !== 0;
        if (isCategoryExist) return;
        $api.post("/category", { title: categoryTitle }).then(res => {
            if (res.data) {
                const newCategory = { id: String(Date.now()), title: categoryTitle };
                const updatedCategory = [...categories, newCategory];
                const updatedFiltered = [...filteredCategories, newCategory];
                setCategories(updatedCategory);
                setFilteredCategories(updatedFiltered);
            }
        });
    };

    const handleDeleteSubCategory = (categoryList: ICategory[], category: ICategory) => {
        const updatedCategory = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === category.id) {
                return prev;
            }
            if (item.categories) {
                const filteredcategories: ICategory[] = handleDeleteSubCategory(item.categories, category);
                return [...prev, { ...item, categories: filteredcategories }];
            }
            return [...prev, item];
        }, []);
        return updatedCategory;
    };

    const handleUpdateCategory = (categoryList: ICategory[], newCategoryData: ICategory) => {
        const updatedCategory = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === newCategoryData.id) {
                return [...prev, newCategoryData];
            }
            if (item.categories) {
                const updatedCategories: ICategory[] = handleUpdateCategory(item.categories, newCategoryData);
                return [...prev, { ...item, categories: updatedCategories }];
            }
            return [...prev, item];
        }, []);
        return updatedCategory;
    };

    const handleFindCategoryAndAddIntoNewCategory = (
        currentCategory: ICategory, 
        newCategoryTitle: string, 
        categoryList: ICategory[]
    ) => {
        const updatedCategory = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === currentCategory.id) {
                const createdCategory = {
                    ...item,
                    categories: item.categories 
                        ? [...item.categories, { id: String(Date.now()), title: newCategoryTitle }]
                        : [{ id: String(Date.now()), title: newCategoryTitle }]
                };
                if (!item.categories) {
                    return [...prev, createdCategory];
                }
                if (item.categories?.filter(el => el.title.toLowerCase() === newCategoryTitle.toLowerCase()).length !== 0) {
                    return [...prev, item];
                } else {
                    return [...prev, createdCategory];
                }
            }
            if (item.categories) {
                const updated: ICategory[] = 
                    handleFindCategoryAndAddIntoNewCategory(currentCategory, newCategoryTitle, item.categories);
                return [...prev, { ...item, categories: updated }];
            }
            return [...prev, item];
        }, []);
        return updatedCategory;
    };

    const handleFilterCategoriesByIncludingString = (
        textValue: string,
        categoryList: ICategory[]
    ) => {
        const findedCategories = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.title.toLowerCase().includes(textValue.toLowerCase())) {
                return [...prev, item];
            }
            if (item.categories) {
                const findedItem: ICategory[] = 
                    handleFilterCategoriesByIncludingString(textValue, item.categories);

                if (findedItem.length !== 0) {
                    return [...prev, ...findedItem];
                }
            }
            return prev;
        }, []);
        return findedCategories;
    };

    const handleCheckIsCategoryExist = (
        textValue: string,
        categoryList: ICategory[]
    ) => {
        const findedCategories = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.title.toLowerCase() === textValue.toLowerCase()) {
                return [...prev, item];
            }
            if (item.categories) {
                const findedItem: ICategory[] = 
                    handleCheckIsCategoryExist(textValue, item.categories);
                return [...prev, ...findedItem];
            }
            return prev;
        }, []);
        return findedCategories;
    };

    useEffect(() => {
        $api.get("/category").then(res => {
            if (res.data) {
                setCategories(res.data.categoryList);
                setFilteredCategories(res.data.categoryList);
                handleGetCategoriesDataForSelect(res.data.categoryList);
            }
        });
    }, []);

    return { 
        categories,
        filteredCategories,
        categoriesForSelect,
        setCategories,
        setFilteredCategories,
        handleDeleteSubCategory, 
        handleFindCategoryAndAddIntoNewCategory, 
        handleFilterCategoriesByIncludingString,
        handleAddRootCategory,
        handleUpdateCategory,
        handleCheckIsCategoryExist
    };
};