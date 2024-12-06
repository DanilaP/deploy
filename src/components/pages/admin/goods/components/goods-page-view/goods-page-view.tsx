import { Button, MenuItem, Select, TextField } from "@mui/material";
import { IoMdSearch } from "react-icons/io";
import { ManageGoodForm } from "../../../../../partials/forms/manage-good-form/ManageGood";
import { useTranslation } from "react-i18next";
import { IProduct } from "../../../../../../models/products/products";
import { IProvider } from "../../../../../../models/providers/providers";
import { ISelect } from "../../../../../../interfaces/interfaces";
import CustomModal from "../../../../../components-ui/custom-modal/custom-modal";
import "./goods-page.view.scss";
import GoodWrapper from "../good-wrapper/good-wrapper";

interface IGoodsPageViewProps {
    modals: { manage: boolean, delete: boolean, unsaved: boolean },
    unSavedDataExist: boolean,
    filteredProducts: IProduct[],
    providers: IProvider[],
    categoriesForSelect: ISelect[],
    providersForSelect: ISelect[],
    currentProduct: IProduct | null,
    currentMode: "create" | "edit" | "createFromCopy" | null,
    handleSearchProduct: (value: string) => void,
    handleSearchProductByProvider: (value: string) => void,
    handleFilterProductsByActive: (value: boolean) => void,
    handleOpenCreatingGoodModal: () => void,
    handleOpenEditingGoodModal: (product: IProduct) => void,
    handleGotoProductPage: (product: IProduct) => void,
    handleOpenCreatingFromCopyGoodModal: (product: IProduct) => void,
    handleOpenDeleteGoodModal: (product: IProduct) => void,
    handleGetTitleForManagingGoodsModal: () => string,
    handleCancelUpdating: (unsavedDataExists: boolean) => void,
    handleUpdateGood: (product: IProduct) => void,
    handleUnsavedDataExist: (status: boolean) => void,
    handleCloseUnsavedData: () => void,
    handleApproveDeletingGood: () => void,
    handleCloseDeleteGoodModal: () => void,
}

export default function GoodsPageView({
    modals,
    unSavedDataExist,
    currentMode,
    filteredProducts,
    providers,
    categoriesForSelect,
    providersForSelect,
    currentProduct,
    handleSearchProduct,
    handleSearchProductByProvider,
    handleFilterProductsByActive,
    handleOpenCreatingGoodModal,
    handleOpenEditingGoodModal,
    handleGotoProductPage,
    handleOpenCreatingFromCopyGoodModal,
    handleOpenDeleteGoodModal,
    handleGetTitleForManagingGoodsModal,
    handleCancelUpdating,
    handleUpdateGood,
    handleUnsavedDataExist,
    handleCloseUnsavedData,
    handleApproveDeletingGood,
    handleCloseDeleteGoodModal
}: IGoodsPageViewProps) {

    const { t } = useTranslation();

    return (
        <div className="goods">
            <div className="title">{ t("text.managingGoods") }</div>
            <div className="goods-actions">
                <div className="filters">
                    <TextField
                        onChange={ (e) => handleSearchProduct(e.target.value) } 
                        placeholder={ t("text.searchAll") }
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                    <TextField 
                        onChange={ (e) => handleSearchProductByProvider(e.target.value) } 
                        placeholder={ t("text.provider") }
                        className="search-field"
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                    <Select
                        className="product-active-filter"
                        defaultValue={ 1 }
                        onChange={ (e) => handleFilterProductsByActive(Boolean(e.target.value)) }
                    >
                        <MenuItem value={ 1 }>{ t("text.active") }</MenuItem>
                        <MenuItem value={ 0 }>{ t("text.inactive") }</MenuItem>
                    </Select>
                </div>
                <div className="buttons">
                    <Button
                        variant='contained'
                        onClick={ handleOpenCreatingGoodModal }
                    >{ t("text.createGoods") }</Button>
                </div>
            </div>
            <div className="list">
                {
                    filteredProducts.map(product => {
                        const providerInfo = providers.filter(el => el.id === +product.provider)[0];
                        return (
                            <GoodWrapper
                                key={ product.id }
                                product={ product }
                                providerInfo={ providerInfo }
                                handleGotoProductPage={ handleGotoProductPage }
                                handleOpenCreatingFromCopyGoodModal={ handleOpenCreatingFromCopyGoodModal }
                                handleOpenDeleteGoodModal={ handleOpenDeleteGoodModal }
                                handleOpenEditingGoodModal={ handleOpenEditingGoodModal }
                            />
                        );
                    })
                }
            </div>
            <CustomModal
                isHidden={ modals.unsaved }
                isDisplay={ modals.manage }
                title = { handleGetTitleForManagingGoodsModal() }
                typeOfActions='none'
                actionConfirmed={ () => handleCancelUpdating(unSavedDataExist) }
                closeModal={ () => handleCancelUpdating(unSavedDataExist) }
            >
                <ManageGoodForm
                    handleUpdateGood={ handleUpdateGood }
                    handleCancelUpdating={ () => handleCancelUpdating(unSavedDataExist) }
                    handleUnsavedDataExist={ handleUnsavedDataExist }
                    mode={ currentMode }
                    categoriesForSelect={ categoriesForSelect }
                    providersForSelect={ providersForSelect }
                    goodData={ currentProduct }
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.delete }
                title={ t("text.deleteGoods") }
                typeOfActions='default'
                actionConfirmed={ handleApproveDeletingGood }
                closeModal={ handleCloseDeleteGoodModal }
            >
                <div className="delete-text">{ t("text.approveDeletingGood") }?</div>
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.unsaved }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ () => handleCancelUpdating(false) }
                closeModal={ handleCloseUnsavedData }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ () => handleCancelUpdating(false) }
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
        </div>
    );
}