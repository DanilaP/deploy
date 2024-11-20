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

    const handleAddRootCategory = (categoryTitle: string, description: string, image: string) => {
        const isCategoryExist = handleCheckIsCategoryExist(categoryTitle, categories).length !== 0;
        if (isCategoryExist) return;
        $api.post("/category", { title: categoryTitle }).then(res => {
            if (res.data) {
                const newCategory = { id: String(Date.now()), title: categoryTitle, description, image };
                const updatedCategory = [...categories, newCategory];
                const updatedFiltered = [...filteredCategories, newCategory];
                setCategories(updatedCategory);
                setFilteredCategories(updatedFiltered);
            }
        });
    };

    const handleDeleteCategory = (categoryList: ICategory[], category: ICategory) => {
        const updatedCategory = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === category.id) {
                return prev;
            }
            if (item.categories) {
                const filteredcategories: ICategory[] = handleDeleteCategory(item.categories, category);
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
        image: string,
        description: string,
        categoryList: ICategory[]
    ) => {
        const updatedCategory = categoryList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === currentCategory.id) {
                const createdCategory = {
                    ...item,
                    categories: item.categories 
                        ? [
                            ...item.categories, 
                            { 
                                id: String(Date.now()), 
                                title: newCategoryTitle,
                                image,
                                description
                            }
                        ]
                        : [{ 
                            id: String(Date.now()), 
                            title: newCategoryTitle,
                            image,
                            description
                        }]
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
                    handleFindCategoryAndAddIntoNewCategory(currentCategory, newCategoryTitle, image, description, item.categories);
                return [...prev, { ...item, categories: updated }];
            }
            return [...prev, item];
        }, []);
        return updatedCategory;
    };

    const handleMoveCategoryIntoNewCategory = (
        categoryForAdding: ICategory,
        categoryToAdding: ICategory,
        categoryList: ICategory[]
    ) => {
        const updatedCategoriesList = handleDeleteCategory(categoryList, categoryForAdding);
        const updatedCategories = updatedCategoriesList.reduce((prev: ICategory[], item: ICategory) => {
            if (item.id === categoryToAdding.id) {
                if (item.categories) {
                    return [...prev, { 
                        ...item,
                        categories: [...item.categories, categoryForAdding]
                    }];
                } else {
                    return [...prev, { 
                        ...item,
                        categories: [categoryForAdding]
                    }];
                }
            }
            if (item.categories) {
                const updated: ICategory[] = 
                handleMoveCategoryIntoNewCategory(categoryForAdding, categoryToAdding, item.categories);
                return [...prev, { ...item, categories: updated }];
            }
            return [...prev, item];
        }, []);
        return updatedCategories;
    };

    const handleMoveCategoryAsRoot = (
        categoryForAdding: ICategory,
        categoryList: ICategory[]
    ) => {
        const updatedCategoriesList = handleDeleteCategory(categoryList, categoryForAdding);
        const updatedCategories = [...updatedCategoriesList, categoryForAdding];
        return updatedCategories;
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
        handleDeleteCategory, 
        handleFindCategoryAndAddIntoNewCategory, 
        handleFilterCategoriesByIncludingString,
        handleAddRootCategory,
        handleUpdateCategory,
        handleCheckIsCategoryExist,
        handleMoveCategoryIntoNewCategory,
        handleMoveCategoryAsRoot
    };
};