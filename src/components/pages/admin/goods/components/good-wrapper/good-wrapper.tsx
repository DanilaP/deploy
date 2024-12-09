import { Button } from "@mui/material";
import { IProduct } from "../../../../../../models/products/products";
import { IProvider } from "../../../../../../models/providers/providers";
import { useTranslation } from "react-i18next";
import "./good-wrapper.scss";

interface IGoodWrapperProps {
    product: IProduct,
    providerInfo: IProvider,
    handleOpenEditingGoodModal: (product: IProduct) => void,
    handleGotoProductPage: (product: IProduct) => void,
    handleOpenCreatingFromCopyGoodModal: (product: IProduct) => void,
    handleOpenDeleteGoodModal: (product: IProduct) => void,
}

export default function GoodWrapper({
    product,
    providerInfo,
    handleOpenEditingGoodModal,
    handleGotoProductPage,
    handleOpenCreatingFromCopyGoodModal,
    handleOpenDeleteGoodModal
}: IGoodWrapperProps) {

    const { t } = useTranslation();

    return (
        <div 
            className="wrapper" 
            key={ product.id }
        >
            <div className="good-avatar" onClick={ () => handleOpenEditingGoodModal(product) } >
                <img 
                    className="good-image" 
                    src={ product.images[0] } 
                    width="50px" 
                    height="50px"
                />
            </div>
            <div className="good-info" onClick={ () => handleOpenEditingGoodModal(product) } >
                <div className="good-info-main">
                    <div className="good-title">{ product.name }</div>
                    <div className="good-price">
                        { t("text.price") }:
                        {
                            product.variations.length === 0
                                ? product.price
                                : product.variations[0].price
                        }
                    </div>
                    <div className="good-provider">{ providerInfo?.name }</div>
                </div>
                <div className="good-info-more">
                    <div className="good-description">
                        { t("text.description") }: { product.description }
                    </div>
                </div>
            </div>
            <div className="good-actions">
                <Button
                    variant='outlined'
                    onClick={ () => handleGotoProductPage(product) }
                >{ t("text.goto") }</Button>
                <Button
                    variant='outlined'
                    onClick={ () => handleOpenCreatingFromCopyGoodModal(product) }
                >{ t("text.createFromCopy") }</Button>
                <Button
                    variant='outlined'
                    onClick={ () => handleOpenEditingGoodModal(product) }
                >{ t("text.edit") }</Button>
                {
                    product.active
                    ? 
                    <Button
                        variant='outlined'
                        onClick={ () => handleOpenDeleteGoodModal(product) }
                    >{ t("text.delete") }</Button>
                    : null
                }
            </div>
        </div>
    );
}