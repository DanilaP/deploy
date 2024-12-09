import $api from '../../configs/axiosconfig/axios.js';
import { IDiscount } from './discounts.js';

export const createDiscount = (newDiscount: IDiscount) => {
    const response = $api.post("/discounts", newDiscount);
    return response;
};

export const getDiscounts = () => {
    const response = $api.get("/discounts");
    return response;
};

export const deleteProduct = (discountId: number) => {
    const response = $api.delete(`/discountId?discountId=${discountId}`);
    return response;
};