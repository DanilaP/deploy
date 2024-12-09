import $api from '../../configs/axiosconfig/axios.js';
import { IDiscount } from './discounts.js';

export const createDiscount = (newDiscount: IDiscount) => {
    const response = $api.post("/discounts", newDiscount);
    return response;
};

export const updateDiscount = (newDiscount: IDiscount) => {
    const response = $api.put("/discounts", newDiscount);
    return response;
};

export const getDiscounts = () => {
    const response = $api.get("/discounts");
    return response;
};

export const deleteDiscount = (discountId: number) => {
    const response = $api.delete(`/discounts?discountId=${discountId}`);
    return response;
};