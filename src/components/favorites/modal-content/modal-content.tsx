import { t } from "i18next";
import { IProduct } from "../../../interfaces/interfaces";
import './modal-content.scss';
import { Button } from "@mui/material";

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
                    )
                })
            }
        </div>
    );
}