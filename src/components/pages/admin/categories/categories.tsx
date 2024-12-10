import { useState } from "react";
import { useCategories } from '../../../../models/categories/use-categories.js';
import { ICategory } from '../../../../models/categories/categories.js';
import { ICategoryForm } from './components/category-manage-form/category-manage-form.js';
import CategoriesPageView from './components/categories-page-view/categories-page-view.js';

export const CategoriesPage = () => {

    const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [mode, setMode] = useState<"edit" | "create" | "">("");
    const [modals, setModals] = useState({ manage: false, deletionConfirm: false, unsavedData: false });
    const [unsavedDataExist, setUnsavedDataExist] = useState<boolean>(false);
    const [draggableCategory, setDraggableCategory] = useState<ICategory | null>(null);
    const [categoryForAdding, setCategoryForAdding] = useState<ICategory | null>(null);

    const { 
        categories,
        filteredCategories,
        setCategories, 
        setFilteredCategories,
        handleDeleteCategory,
        handleFindCategoryAndAddIntoNewCategory,
        handleFilterCategoriesByIncludingString,
        handleAddRootCategory,
        handleUpdateCategory,
        handleMoveCategoryIntoNewCategory,
        handleMoveCategoryAsRoot
    } = useCategories();
    
    const handleOpenAddSubCategory = (e: any, category: ICategory | null) => {
        e.stopPropagation();
        setCurrentCategory(category);
        setMode("create");
        setModals(prev => {
            return { ...prev, manage: true };
        });
    };

    const handleOpenEditCategory = (e: any, category: ICategory | null) => {
        e.stopPropagation();
        setCurrentCategory(category);
        setMode("edit");
        setModals(prev => {
            return { ...prev, manage: true };
        });
    };

    const handleOpenConfirmDeletion = (e: any, category: ICategory) => {
        e.stopPropagation();
        setModals(prev => {
            return { ...prev, deletionConfirm: true };
        });
        setCurrentCategory(category);
    };
    
    const handleCloseConfirmDeletion = () => {
        setModals(prev => {
            return { ...prev, deletionConfirm: false };
        });
        setCurrentCategory(null);
    };

    const handleApproveAddingCategory = (formData: ICategoryForm) => {
        const { image, title, description } = formData;
        if (mode === "create") {
            if (currentCategory) {
                const updatedCategory = handleFindCategoryAndAddIntoNewCategory(
                    currentCategory, title, image, description, categories
                );
                const updatedFiltered = handleFindCategoryAndAddIntoNewCategory(
                    currentCategory, title, image, description, filteredCategories
                );
                setCategories(updatedCategory);
                setFilteredCategories(updatedFiltered);
            } else {
                handleAddRootCategory(title, description, image);
            }
        } 
        if (mode === "edit") {
            if (currentCategory) {
                const updatedCategory = handleUpdateCategory(categories, { ...currentCategory, title, description, image });
                const updatedFiltered = handleUpdateCategory(filteredCategories, { ...currentCategory, title, description, image });
                setCategories(updatedCategory);
                setFilteredCategories(updatedFiltered);
            }
        }
        setModals(prev => {
            return { ...prev, manage: false };
        });
        setCurrentCategory(null);
    };

    const handleCancelAddingCategory = () => {
        if (unsavedDataExist) {
            setModals(prev => {
                return { ...prev, unsavedData: true };
            });
        } else {
            setModals(prev => {
                return { ...prev, manage: false };
            });
        }
    };

    const handleUpdateUnsavedData = (status: boolean) => {
        setUnsavedDataExist(status);
    };

    const handleCloseWithUnsavedData = () => {
        setModals(prev => {
            return { ...prev, unsavedData: false, manage: false };
        });
    };

    const handleCloseUnsavedData = () => {
        setModals(prev => {
            return { ...prev, unsavedData: false };
        });
    };
    
    const handleClickTreeItem = (category: ICategory) => {
        if (expandedItems.filter(el => el === category.id).length !== 0) {
            setExpandedItems(items => items.filter(el => el !== category.id));
        } else {
            setExpandedItems(prev => [...prev, category.id]);
        }
    };

    const handleApproveDeleteSubCategory = (category: ICategory | null) => {
        if (!category) return;
        const updatedCategories = handleDeleteCategory(categories, category);
        const updatedFiltered = handleDeleteCategory(filteredCategories, category);
        setCategories(updatedCategories);
        setFilteredCategories(updatedFiltered);
        setModals((prev) => {
            return { ...prev, deletionConfirm: false };
        });
        setCurrentCategory(null);
    };

    const handleStartSearchingCategories = (textValue: string) => {
        if (textValue.length === 0) {
            setFilteredCategories(categories);
        }
        if (textValue.length < import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH) return;
        const findedCategories = handleFilterCategoriesByIncludingString(textValue, categories);
        setFilteredCategories(findedCategories);
    };

    const handleUpdateDraggableCategory = (category: ICategory | null) => {
        setDraggableCategory(category);
    };

    const handleUpdateAddingCategory = (category: ICategory | null) => {
        setCategoryForAdding(category);
    };

    const handleMoveCategoryIntoNewCategoryWithFiltered = () => {
        let updatedCategories: ICategory[] = [];
        let updatedFilteredCategories: ICategory[] = [];

        if (draggableCategory && !categoryForAdding) {
            updatedCategories = handleMoveCategoryAsRoot(draggableCategory, categories);
            updatedFilteredCategories = handleMoveCategoryAsRoot(draggableCategory, filteredCategories);
        }
        if (draggableCategory && categoryForAdding && draggableCategory.id !== categoryForAdding.id) {
            updatedFilteredCategories = handleMoveCategoryIntoNewCategory(draggableCategory, categoryForAdding, filteredCategories);
            updatedCategories = handleMoveCategoryIntoNewCategory(draggableCategory, categoryForAdding, categories);
        }
        if (updatedCategories.length !== 0 && updatedFilteredCategories.length !== 0) {
            setFilteredCategories(updatedFilteredCategories);
            setCategories(updatedCategories);
        }
        setDraggableCategory(null);
        setCategoryForAdding(null);
    };

    const handleDragEnterToCategoriesPage = (e: any) => {
        e.stopPropagation();
        setCategoryForAdding(null);
    };

    return (
        <CategoriesPageView
            modals={ modals }
            mode={ mode }
            categoryForAdding={ categoryForAdding }
            filteredCategories={ filteredCategories }
            currentCategory={ currentCategory }
            draggableCategory={ draggableCategory }
            expandedItems={ expandedItems }
            handleApproveAddingCategory={ handleApproveAddingCategory }
            handleApproveDeleteSubCategory={ handleApproveDeleteSubCategory }
            handleCancelAddingCategory={ handleCancelAddingCategory }
            handleClickTreeItem={ handleClickTreeItem }
            handleCloseConfirmDeletion={ handleCloseConfirmDeletion }
            handleCloseUnsavedData={ handleCloseUnsavedData }
            handleCloseWithUnsavedData={ handleCloseWithUnsavedData }
            handleDragEnterToCategoriesPage={ handleDragEnterToCategoriesPage }
            handleMoveCategoryIntoNewCategoryWithFiltered={ handleMoveCategoryIntoNewCategoryWithFiltered }
            handleOpenAddSubCategory={ handleOpenAddSubCategory }
            handleOpenConfirmDeletion={ handleOpenConfirmDeletion } 
            handleOpenEditCategory={ handleOpenEditCategory }
            handleStartSearchingCategories={ handleStartSearchingCategories }
            handleUpdateAddingCategory={ handleUpdateAddingCategory }
            handleUpdateDraggableCategory={ handleUpdateDraggableCategory }
            handleUpdateUnsavedData={ handleUpdateUnsavedData } 
        />
    );
};
