import { Button, TextField } from "@mui/material";
import { IoMdSearch } from "react-icons/io";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { ICategory } from "../../../../../../models/categories/categories";
import { useTranslation } from "react-i18next";
import CategoriesTreeItems from "../categories-tree-items/categories-tree-items";
import CustomModal from "../../../../../components-ui/custom-modal/custom-modal";
import CategoryManageForm, { ICategoryForm } from "../category-manage-form/category-manage-form";
import "./categories-page-view.scss";

interface ICategoriesPageViewProps {
    modals: { manage: boolean, deletionConfirm: boolean, unsavedData: boolean },
    mode: "edit" | "create" | "",
    filteredCategories: ICategory[],
    expandedItems: string[],
    currentCategory: ICategory | null,
    categoryForAdding: ICategory | null,
    draggableCategory: ICategory | null,
    handleDragEnterToCategoriesPage: (e: any) => void,
    handleStartSearchingCategories: (value: string) => void,
    handleOpenAddSubCategory: (e: any, category: ICategory | null) => void,
    handleOpenConfirmDeletion: (e: any, category: ICategory) => void,
    handleOpenEditCategory: (e: any, category: ICategory | null) => void,
    handleUpdateDraggableCategory: (category: ICategory | null) => void,
    handleClickTreeItem: (category: ICategory) => void,
    handleUpdateAddingCategory: (category: ICategory | null) => void,
    handleMoveCategoryIntoNewCategoryWithFiltered: () => void,
    handleCloseWithUnsavedData: () => void,
    handleCancelAddingCategory: () => void,
    handleApproveAddingCategory: (formData: ICategoryForm) => void,
    handleUpdateUnsavedData: (status: boolean) => void,
    handleCloseUnsavedData: () => void,
    handleApproveDeleteSubCategory: (category: ICategory | null) => void,
    handleCloseConfirmDeletion: () => void,
}

export default function CategoriesPageView({
    modals,
    mode,
    filteredCategories,
    expandedItems,
    categoryForAdding,
    draggableCategory,
    currentCategory,
    handleDragEnterToCategoriesPage,
    handleStartSearchingCategories,
    handleOpenAddSubCategory,
    handleClickTreeItem,
    handleOpenConfirmDeletion,
    handleOpenEditCategory,
    handleUpdateDraggableCategory,
    handleUpdateAddingCategory,
    handleMoveCategoryIntoNewCategoryWithFiltered,
    handleCloseWithUnsavedData,
    handleCancelAddingCategory,
    handleApproveAddingCategory,
    handleUpdateUnsavedData,
    handleCloseUnsavedData,
    handleApproveDeleteSubCategory,
    handleCloseConfirmDeletion
}: ICategoriesPageViewProps) {

    const { t } = useTranslation();

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
                closeModal={ handleCloseConfirmDeletion }
            >
                <div className="delete-text">{ t("text.confirmDeletingCategory") }?</div>
            </CustomModal>
        </div>
    );
}