import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useState } from "react";
import { ICategory } from "../../../interfaces/interfaces.js";
import { useTranslation } from "react-i18next";
import { Button, TextField } from "@mui/material";
import { useCategoryHelper } from "../../../helpers/use-category-helper.js";
import { IoMdSearch } from "react-icons/io";
import CategoriesTreeItems from "./CategoriesTreeItems/CategoriesTreeItems.js";
import CustomModal from "../../../components-ui/custom-modal/custom-modal.js";
import "./categories.scss";
import CategoryManageForm, { ICategoryForm } from './CategoryManageForm/CategoryManageForm.js';

export const CategoriesPage = () => {

    const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [mode, setMode] = useState<"edit" | "create" | "">("");
    const [modals, setModals] = useState({ manage: false, deletionConfirm: false, unsavedData: false });
    const [unsavedDataExist, setUnsavedDataExist] = useState<boolean>(false);
    const [draggableCategory, setDraggableCategory] = useState<ICategory | null>(null);
    const [categoryForAdding, setCategoryForAdding] = useState<ICategory | null>(null);

    const { t } = useTranslation();
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
    } = useCategoryHelper();
    
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
        <div 
            className="category-page"
            onDragEnter={ handleDragEnterToCategoriesPage }
        >
            <div className="category-page-title">Управление категориями</div>
            <div className="category-page-search">
                <div className="category-page-search-value">
                    <TextField 
                        onChange={ (e) => handleStartSearchingCategories(e.target.value) } 
                        placeholder={ t("text.name") }
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                </div>
                <div className="categore-page-actions">
                    <Button
                        variant='contained'
                        onClick={ (e) => handleOpenAddSubCategory(e, null) }
                    >{ t("text.createCategory") }</Button>
                </div>
            </div>
            <div className="category-page-content">
                <SimpleTreeView expandedItems={ expandedItems }>
                    <CategoriesTreeItems
                        items={ filteredCategories }
                        categoryForAdding={ categoryForAdding }
                        draggableCategory={ draggableCategory }
                        handleClickTreeItem={ handleClickTreeItem }
                        handleOpenAddSubCategory={ handleOpenAddSubCategory }
                        handleOpenConfirmDeletion={ handleOpenConfirmDeletion }
                        handleOpenEditCategory={ handleOpenEditCategory }
                        handleUpdateDraggableCategory={ handleUpdateDraggableCategory }
                        handleUpdateAddingCategory={ handleUpdateAddingCategory }
                        handleMoveCategoryIntoNewCategoryWithFiltered={ handleMoveCategoryIntoNewCategoryWithFiltered }
                    />
                </SimpleTreeView>
            </div>
            <CustomModal
                isHidden={ modals.unsavedData }
                isDisplay={ modals.manage }
                title = { mode === "edit" ? t("text.editCategory") : t("text.addCategory") }
                typeOfActions='none'
                actionConfirmed={ handleCloseWithUnsavedData }
                closeModal={ handleCancelAddingCategory }
            >
                <CategoryManageForm
                    currentCategory={ currentCategory }
                    handleApproveAddingCategory={ handleApproveAddingCategory }
                    handleUpdateUnsavedData={ handleUpdateUnsavedData }
                    handleCancelAddingCategory={ handleCancelAddingCategory }
                    mode={ mode }
                />
            </CustomModal>
            <CustomModal
                isDisplay={ modals.unsavedData }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ handleCancelAddingCategory }
                closeModal={ handleCancelAddingCategory }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ handleCloseWithUnsavedData }
                        >{ t("text.close") }</Button>
                        <Button
                            onClick={ handleCloseUnsavedData }
                            variant="contained"
                        >{ t("text.cancel") }</Button>
                    </>
                }
            >
                <div className="delete-text">{ t("text.unsavedChanges") }?</div>
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.deletionConfirm }
                title={ t("text.approveAction") }
                typeOfActions='default'
                actionConfirmed={ () => handleApproveDeleteSubCategory(currentCategory) }
                closeModal={ () => setModals(prev => { 
                        return { ...prev, deletionConfirm: false };
                    }
                ) }
            >
                <div className="delete-text">{ t("text.confirmDeletingCategory") }?</div>
            </CustomModal>
        </div>
    );
};
