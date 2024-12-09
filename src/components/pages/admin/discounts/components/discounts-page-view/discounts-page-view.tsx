import { useTranslation } from "react-i18next";
import { 
    Button, 
    IconButton, 
    MenuItem, 
    Select, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField 
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { IDiscount } from "../../../../../../models/discounts/discounts";
import { ISelect } from "../../../../../../interfaces/interfaces";
import CustomModal from "../../../../../components-ui/custom-modal/custom-modal";
import DiscountPageForm from "../discount-page-form/discount-page-form";
import "./discounts-page-view.scss";

interface IDiscountsPageViewProps {
    discounts: IDiscount[],
    currentDiscount: IDiscount | null,
    modals: { manage: boolean, confirmDeleting: boolean },
    categoriesForSelect: ISelect[],
    discountTypesForSelect: ISelect[],
    handleGetCountOfProductsForDiscount: (discount: IDiscount) => number,
    handleOpenCreateDiscountModal: () => void,
    handleOpenEditDiscountModal: (discountId: number) => void,
    handleCloseManageDiscountModal: () => void,
    handleSaveDiscountData: (discount: IDiscount) => void,
    handleCancelDeletingDiscount: () => void,
    handleConfirmDeletingDiscount: () => void,
    handleOpenDeletingDiscountModal: (discountId: number) => void
}

export default function DiscountsPageView({
    discounts,
    modals,
    currentDiscount,
    categoriesForSelect,
    discountTypesForSelect,
    handleGetCountOfProductsForDiscount,
    handleOpenCreateDiscountModal,
    handleOpenEditDiscountModal,
    handleCloseManageDiscountModal,
    handleSaveDiscountData,
    handleCancelDeletingDiscount,
    handleConfirmDeletingDiscount,
    handleOpenDeletingDiscountModal
}: IDiscountsPageViewProps) {
    
    const { t } = useTranslation();
    
    return (
        <div className="discounts-page-view">
            <div className="discount-page-title">
                { t("text.manageDiscounts") }
            </div>
            <div className="discount-page-actions">
                <div className="filters">
                    <TextField
                        onChange={ (e) => console.log(e.target.value) } 
                        placeholder={ t("text.searchAll") }
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                    <Select
                        className="discount-active-filter"
                        defaultValue={ 1 }
                        onChange={ (e) => console.log(Boolean(e.target.value)) }
                    >
                        <MenuItem value={ 1 }>{ t("text.active") }</MenuItem>
                        <MenuItem value={ 0 }>{ t("text.inactive") }</MenuItem>
                    </Select>
                </div>
                <div className="buttons">
                    <Button
                        variant='contained'
                        onClick={ handleOpenCreateDiscountModal }
                    >{ t("text.createDiscount") }</Button>
                </div>
            </div>
            <div className="discount-page-content">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow className="discount-row">
                                <TableCell>{ t("text.name") }</TableCell>
                                <TableCell>{ t("text.dateStart") }</TableCell>
                                <TableCell>{ t("text.dateEnd") }</TableCell>
                                <TableCell>{ t("text.active") }</TableCell>
                                <TableCell>{ t("text.value") }</TableCell>
                                <TableCell>{ t("text.countOfProducts") }</TableCell>
                                <TableCell>
                                    { t("text.delete") }
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                discounts.map(el => {
                                    return (
                                        <TableRow 
                                            className="discount-row" 
                                            key={ el.id }
                                            onClick={ () => handleOpenEditDiscountModal(el.id) }
                                        >
                                            <TableCell>{ el.name }</TableCell>
                                            <TableCell>{ el.dateStart }</TableCell>
                                            <TableCell>
                                                { 
                                                    el.dateEnd
                                                    ? el.dateEnd
                                                    : t("text.unlimited")
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    el.active 
                                                    ? <span className="active-discount">{ t("text.active") }</span>
                                                    : <span className="inactive-discount">{ t("text.inactive") }</span>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    el.type === "promo"
                                                    ? el.value + "р"
                                                    : el.value + "%"
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    handleGetCountOfProductsForDiscount(el)
                                                }
                                            </TableCell>
                                            <TableCell className="discounts-actions">
                                                <IconButton
                                                    className="mui-actions"
                                                    onClick={ (e: any) => {
                                                        e.stopPropagation();
                                                        handleOpenDeletingDiscountModal(el.id);
                                                    } }
                                                >
                                                    <MdDelete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <CustomModal
                isDisplay={ modals.manage }
                title = { currentDiscount ? "text.editDiscount" : "text.createDiscount" }
                typeOfActions='none'
                actionConfirmed={ handleCloseManageDiscountModal }
                closeModal={ handleCloseManageDiscountModal }
            >
                <DiscountPageForm
                    currentDiscount={ currentDiscount }
                    categoriesForSelect={ categoriesForSelect }
                    discountTypesForSelect={ discountTypesForSelect }
                    handleCloseModal={ handleCloseManageDiscountModal }
                    handleSaveDiscountData={ handleSaveDiscountData }
                />
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.confirmDeleting }
                title={ t("text.disableDiscount") }
                typeOfActions='default'
                actionConfirmed={ handleConfirmDeletingDiscount }
                closeModal={ handleCancelDeletingDiscount }
            >
                <div className="delete-text">{ t("text.approveDisablingDiscount") }?</div>
            </CustomModal>
        </div>
    );
}