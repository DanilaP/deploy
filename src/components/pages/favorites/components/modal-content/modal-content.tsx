import { t } from "i18next";
import './modal-content.scss';
import { Button } from "@mui/material";
import { IProduct } from "../../../../../models/products/products";

export default function ModalContent (props: { products: IProduct[], removeProduct: (productId: number) => void }) {

    return (
        <div className="modal-content">
            {
                props.products.map((product: IProduct) => {
                    return (
                        <div key={ product.id } className="modal-content-product">
                            <img src = { product.images[0] } className="image"/>
                            <div className="name">{ product.name }</div>
                            <div className="price">{ product.variations[0].price } { t("text.rub") }</div>
                            <Button onClick={ () => props.removeProduct(product.id) } variant='outlined'>{ t("text.delete") }</Button>
                        </div>
                    );
                })
            }
        </div>
    );
}