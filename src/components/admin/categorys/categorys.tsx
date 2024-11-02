import "./categorys.scss";
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useState } from "react";
import AddBoxIcon from '@material-ui/icons/AddBox';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from "@mui/material/IconButton";
import { ICategory } from "../../../interfaces/interfaces.js";
import CustomModal from "../../../components-ui/custom-modal/custom-modal.js";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import SearchIcon from '@material-ui/icons/Search';
import { useCategoryHelper } from "../../../helpers/use-category-helper.js";

export const CategorysPage = () => {

    const [currentCategory, setCurrentCategory] = useState<ICategory>({} as ICategory);
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>("");
    const [modals, setModals] = useState({ add: false });
    const { t } = useTranslation();
    const { 
        categorys, 
        setCategorys, 
        handleDeleteSubCategory,
        handleFindCategoryAndAddIntoNewCategory
    } = useCategoryHelper();
    
    const handleOpenAddSubCategory = (e: any, category: ICategory) => {
        e.stopPropagation();
        setCurrentCategory(category);
        setModals(prev => {
            return { ...prev, add: true };
        });
    };

    const handleApproveAddingCategory = () => {
        if (newCategoryTitle.trim().length === 0) return;
        const updatedCategory = handleFindCategoryAndAddIntoNewCategory(currentCategory, newCategoryTitle, categorys);
        setCategorys(updatedCategory);
        setModals(prev => {
            return { ...prev, add: false };
        });
        return updatedCategory;
    };

    const handleApproveDeleteSubCategory = (e: any, categoryList: ICategory[], category: ICategory) => {
        e.stopPropagation();
        handleDeleteSubCategory(categoryList, category);
    };

    const renderCategories = (items: ICategory[]) => {
        return items.map((category: ICategory) => (
            <TreeItem
                key={category.id} 
                itemId={category.id} 
                label={
                    <div className="category-item">
                        <div className="category-title">{category.title}</div>
                        <div className="category-actions">
                            <IconButton
                                className="mui-actions" 
                                onClick={(e) => handleOpenAddSubCategory(e, category)} 
                            >
                                <AddBoxIcon />
                            </IconButton>
                            <IconButton 
                                className="mui-actions" 
                                onClick={(e) => handleApproveDeleteSubCategory(e, categorys, category)} 
                            >
                                <BackspaceIcon />
                            </IconButton>
                        </div>
                    </div>
                }
                className={`${ 
                    category.categorys && category.categorys.length !== 0
                        ? "not-empty-category" 
                        : "empty-category" 
                }`}
            >
                {category.categorys &&
                category.categorys.length > 0 &&
                renderCategories(category.categorys)}
            </TreeItem>
        ));
    };

    return (
        <div className="category-page">
            <div className="category-page-title">Управление категориями</div>
            <div className="category-page-search">
                <TextField 
                    onChange={ (e) => console.log(1) } 
                    placeholder={t("text.name")}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon />
                        ),
                    }}
                />
            </div>
            <div className="category-page-content">
                <SimpleTreeView>
                    {renderCategories(categorys)}
                </SimpleTreeView>
            </div>
            <CustomModal 
                isDisplay={ modals.add }
                title = { t("text.addCategory") }
                typeOfActions='default'
                actionConfirmed={ handleApproveAddingCategory }
                closeModal={ () => setModals({ ...modals, add: false }) }
            >
                <div className="adding-category">
                    <label className="label" htmlFor="update-good-providernew-category-title">{t("text.name")}</label>
                    <TextField
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        id="new-category-title"
                        placeholder={t("text.name")}
                    />
                </div>
            </CustomModal>
        </div>
    );
};
