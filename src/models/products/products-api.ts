import $api from '../../configs/axiosconfig/axios.js';
import { IProduct } from './products.js';

export const createProduct = (newProduct: IProduct) => {
    const response = $api.post("/product", newProduct);
    return response;
};

export const getProducts = () => {
    const response = $api.get("/products");
    return response;
};

export const deleteProduct = (productId: number) => {
    const response = $api.delete(`/product?productId=${productId}`);
    return response;
};

export const updateProduct = (newProductData: IProduct) => {
    const response = $api.put("/product", { body: newProductData });
    return response;
};