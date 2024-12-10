import $api from '../../configs/axiosconfig/axios.js';
import { IUser } from './user.js';

export const getUser = () => {
    const response = $api.get("/profile");
    return response;
};
export const createUser = (newUserData: any) => {
    const response = $api.post("/users", { ...newUserData });
    return response;
};
export const deleteUser = (userId: string) => {
    const response = $api.delete(`/users?id=${ userId }`);
    return response;
};
export const updateUser = (updatedUserInfo: IUser) => {
    const response = $api.put("/users", updatedUserInfo);
    return response;
};
export const getUsers = () => {
    const response = $api.get("/users");
    return response;
};
export const getUserBacketInfo = () => {
    const response = $api.get("/backet");
    return response;
};
export const deleteProductFromUserBacket = (ids: string) => {
    const response = $api.delete(`/backet`, {
        params: {
            ids,
        }
    });
    return response;
};
export const addProductToUserBacket = (productInfo: any[]) => {
    const response = $api.post("/backet", productInfo);
    return response;
};