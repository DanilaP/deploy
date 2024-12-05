import $api from '../../configs/axiosconfig/axios.js';
import { IWarehouse } from './warehouse.js';

export const getWarehouses = () => {
    const response = $api.get("/warehouses");
    return response;
};
export const createWarehouse = (warehouseInfo: any) => {
    const response = $api.post("/warehouses", { ...warehouseInfo });
    return response;
};
export const deleteWarehouse = (warehouse: IWarehouse) => {
    const response = $api.delete(`/warehouses?id=${ warehouse.id }`);
    return response;
};
export const updateWarehouses = (warehouses: IWarehouse[]) => {
    const response = $api.put("/warehouses", warehouses);
    return response;
};