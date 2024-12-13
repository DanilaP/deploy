import { useEffect, useState } from "react";
import { IWarehouse } from "./warehouse";
import { getWarehouses } from "./warehouse-api";
import { IProduct } from "../products/products";

export const useWarehouse = () => {

    const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);

    const handleCheckProductInStock = (product: IProduct) => {
        let isInStock = false;
        warehouses.forEach((store: IWarehouse) => {
            const findedProduct = store.products.find(el => el.productId === product.id);
            if (findedProduct && findedProduct.amount !== 0) {
                isInStock = true;
                return;
            }
        });
        return isInStock;
    };

    useEffect(() => {
        getWarehouses().then(res => { 
            if (res.data.stores) {
                setWarehouses(res.data.stores);   
            }
        });
    }, []);

    return {
        warehouses,
        handleCheckProductInStock
    };
};