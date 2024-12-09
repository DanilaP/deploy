import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { IconButton } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { BiMessageSquareAdd } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { ICategory } from '../../../../../../models/categories/categories';

interface ICategoriesTreeItemsProps {
    items: ICategory[],
    draggableCategory: ICategory | null,
    categoryForAdding: ICategory | null,
    handleClickTreeItem: (category: ICategory) => void
    handleOpenEditCategory: (e: any, category: ICategory) => void,
    handleOpenAddSubCategory: (e: any, category: ICategory) => void,
    handleOpenConfirmDeletion: (e: any, category: ICategory) => void,
    handleUpdateDraggableCategory: (category: ICategory | null) => void,
    handleUpdateAddingCategory: (category: ICategory | null) => void,
    handleMoveCategoryIntoNewCategoryWithFiltered: () => void
}

export default function CategoriesTreeItems({
    items,
    draggableCategory,
    categoryForAdding,
    handleClickTreeItem,
    handleOpenEditCategory,
    handleOpenAddSubCategory,
    handleOpenConfirmDeletion,
    handleUpdateDraggableCategory,
    handleUpdateAddingCategory,
    handleMoveCategoryIntoNewCategoryWithFiltered
}: ICategoriesTreeItemsProps) {

    return items.map((category: ICategory) => (
        <TreeItem
            draggable
            onDragEnd={ handleMoveCategoryIntoNewCategoryWithFiltered }
            onDragStart={ (e) => {
                e.stopPropagation();
                handleUpdateDraggableCategory(category);
            } }
            onDragEnter={ (e) => {
                e.stopPropagation();
                handleUpdateAddingCategory(category);
            } }
            onClick={ () => handleClickTreeItem(category) }
            key={ category.id }
            itemId={ category.id }
            className={ `
                ${ 
                    category.categories && category.categories.length !== 0
                        ? "not-empty-category" 
                        : "empty-category" 
                }
                ${ 
                    draggableCategory?.id === category.id
                        ? "hidden-category" 
                        : "shown-category" 
                }
                ${ 
                    categoryForAdding?.id === category.id
                        ? "current-drag-over-category" 
                        : "current-default-category" 
                }
            ` }
            label={
                <div className="category-item">
                    <div className="category-image">
                        <img src={ category.image } width="30px" height="30px" />
                    </div>
                    <div className="category-title">
                        { category.title }
                        {
                        (category.categories && category.categories.length !== 0) 
                            ? ` (${category.categories?.length})`
                            : ""
                        }
                    </div>
                    <div className="category-actions">
                        <IconButton
                            className="mui-actions" 
                            onClick={ (e) => handleOpenEditCategory(e, category) } 
                        >
                            <FaEdit />
                        </IconButton>
                        <IconButton
                            className="mui-actions" 
                            onClick={ (e) => handleOpenAddSubCategory(e, category) } 
                        >
                            <BiMessageSquareAdd />
                        </IconButton>
                        <IconButton
                            className="mui-actions" 
                            onClick={ (e) => handleOpenConfirmDeletion(e, category) } 
                        >
                            <MdDelete />
                        </IconButton>
                    </div>
                </div>
            }
        >
            { category.categories && category.categories.length > 0 &&
                <CategoriesTreeItems
                    items={ category.categories }
                    draggableCategory={ draggableCategory }
                    categoryForAdding={ categoryForAdding }
                    handleClickTreeItem={ handleClickTreeItem }
                    handleOpenAddSubCategory={ handleOpenAddSubCategory }
                    handleOpenConfirmDeletion={ handleOpenConfirmDeletion }
                    handleOpenEditCategory={ handleOpenEditCategory }
                    handleUpdateDraggableCategory={ handleUpdateDraggableCategory }
                    handleUpdateAddingCategory={ handleUpdateAddingCategory }
                    handleMoveCategoryIntoNewCategoryWithFiltered={ handleMoveCategoryIntoNewCategoryWithFiltered }
                />
            }
        </TreeItem>
    ));
}