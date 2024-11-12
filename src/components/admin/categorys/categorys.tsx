import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useState } from "react";
import { ICategory } from "../../../interfaces/interfaces.js";
import { useTranslation } from "react-i18next";
import { Button, TextField } from "@mui/material";
import { useCategoryHelper } from "../../../helpers/use-category-helper.js";
import { IoMdSearch } from "react-icons/io";
import { validateNewCategory } from "./validators.js";
import CategoriesTreeItems from "./CategoriesTreeItems/CategoriesTreeItems.js";
import CustomModal from "../../../components-ui/custom-modal/custom-modal.js";
import "./categorys.scss";

export const CategorysPage = () => {

    const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null);
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [mode, setMode] = useState<"edit" | "create" | null>(null);
    const [isFormChecked, setIsFormChecked] = useState<boolean>(false);
    const [modals, setModals] = useState({ manage: false, deletionConfirm: false });
    const { t } = useTranslation();
    const validatorFormData = validateNewCategory(newCategoryTitle);
    const { 
        categories,
        filteredCategories,
        setCategories, 
        setFilteredCategories,
        handleDeleteSubCategory,
        handleFindCategoryAndAddIntoNewCategory,
        handleFilterCategoriesByIncludingString,
        handleAddRootCategory,
        handleUpdateCategory
    } = useCategoryHelper();
    

    const handleOpenAddSubCategory = (e: any, category: ICategory | null) => {
        e.stopPropagation();
        setCurrentCategory(category);
        setNewCategoryTitle("");
        setMode("create");
        setModals(prev => {
            return { ...prev, manage: true };
        });
    };

    const handleOpenEditCategory = (e: any, category: ICategory | null) => {
        e.stopPropagation();
        setCurrentCategory(category);
        setMode("edit");
        setNewCategoryTitle(category?.title || "");
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

    const handleApproveAddingCategory = () => {
        if (!validatorFormData.formValid) {
            setIsFormChecked(true);
            return;
        }
        if (mode === "create") {
            if (currentCategory) {
                const updatedCategory = handleFindCategoryAndAddIntoNewCategory(currentCategory, newCategoryTitle, categories);
                const updatedFiltered = handleFindCategoryAndAddIntoNewCategory(currentCategory, newCategoryTitle, filteredCategories);
                setCategories(updatedCategory);
                setFilteredCategories(updatedFiltered);
            } else {
                handleAddRootCategory(newCategoryTitle);
            }
        } 
        if (mode === "edit") {
            if (currentCategory) {
                const updatedCategory = handleUpdateCategory(categories, { ...currentCategory, title: newCategoryTitle });
                const updatedFiltered = handleUpdateCategory(filteredCategories, { ...currentCategory, title: newCategoryTitle });
                setCategories(updatedCategory);
                setFilteredCategories(updatedFiltered);
            }
        }
        setModals(prev => {
            return { ...prev, manage: false };
        });
        setIsFormChecked(false);
        setNewCategoryTitle("");
        setCurrentCategory(null);
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
        const updatedCategories = handleDeleteSubCategory(categories, category);
        const updatedFiltered = handleDeleteSubCategory(filteredCategories, category);
        setCategories(updatedCategories);
        setFilteredCategories(updatedFiltered);
        setModals((prev) => {
            return { ...prev, deletionConfirm: false };
        });
        setCurrentCategory(null);
    };

    const handleStartSearchingCategories = (textValue: string) => {
        if (textValue.length < import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH && textValue.length !== 0) return;
        const findedCategories = handleFilterCategoriesByIncludingString(textValue, categories);
        setFilteredCategories(findedCategories);
    };

    return (
        <div className="category-page">
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
                        handleClickTreeItem={ handleClickTreeItem }
                        handleOpenAddSubCategory={ handleOpenAddSubCategory }
                        handleOpenConfirmDeletion={ handleOpenConfirmDeletion }
                        handleOpenEditCategory={ handleOpenEditCategory }
                    />
                </SimpleTreeView>
            </div>
            <CustomModal 
                isDisplay={ modals.manage }
                title = { mode === "edit" ? t("text.editCategory") : t("text.addCategory") }
                typeOfActions='default'
                actionConfirmed={ handleApproveAddingCategory }
                closeModal={ () => setModals({ ...modals, manage: false }) }
            >
                <div className="adding-category">
                    <label className="label" htmlFor="update-good-providernew-category-title">{ t("text.name") }</label>
                    <TextField
                        defaultValue={ mode === "edit" ? currentCategory?.title : "" }
                        onChange={ (e) => setNewCategoryTitle(e.target.value) }
                        id="new-category-title"
                        placeholder={ t("text.name") }
                    />
                    { !validatorFormData.title.valid && isFormChecked
                        && <span className="adding-category-error">{ t(validatorFormData.title.error) }</span> 
                    }
                </div>
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
