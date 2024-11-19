import { ICategory } from "../../../../interfaces/interfaces";
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { IconButton } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { BiMessageSquareAdd } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

interface ICategoriesTreeItemsProps {
    items: ICategory[],
    handleClickTreeItem: (category: ICategory) => void
    handleOpenEditCategory: (e: any, category: ICategory) => void,
    handleOpenAddSubCategory: (e: any, category: ICategory) => void,
    handleOpenConfirmDeletion: (e: any, category: ICategory) => void,
    handleUpdateDraggableCategory: (category: ICategory | null) => void,
    handleUpdateAddingCategory: (category: ICategory | null) => void
}

export default function CategoriesTreeItems({
    items,
    handleClickTreeItem,
    handleOpenEditCategory,
    handleOpenAddSubCategory,
    handleOpenConfirmDeletion,
    handleUpdateDraggableCategory,
    handleUpdateAddingCategory
}: ICategoriesTreeItemsProps) {

    return items.map((category: ICategory) => (
        <TreeItem
            draggable
            onDragStart={ () => {
                handleUpdateDraggableCategory(category);
            } }
            onDragEnter={ (e) => {
                e.stopPropagation();
                handleUpdateAddingCategory(category);
            } }
            onClick={ () => handleClickTreeItem(category) }
            key={ category.id }
            itemId={ category.id }
            className={ `${ 
                category.categories && category.categories.length !== 0
                    ? "not-empty-category" 
                    : "empty-category" 
            }` }
            label={
                <div className="category-item">
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
                    handleClickTreeItem={ handleClickTreeItem }
                    handleOpenAddSubCategory={ handleOpenAddSubCategory }
                    handleOpenConfirmDeletion={ handleOpenConfirmDeletion }
                    handleOpenEditCategory={ handleOpenEditCategory }
                />
            }
        </TreeItem>
    ));
}