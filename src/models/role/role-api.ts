import $api from '../../configs/axiosconfig/axios.js';
import { IRole } from './role.js';

export const getRoles = () => {
    const response = $api.get("/roles");
    return response;
};
export const createRole = (newRole: IRole) => {
    const response = $api.post("/roles", newRole);
    return response;
};
export const deleteRole = (name: string) => {
    const response = $api.delete(`/roles?name=${ name }`);
    return response;
};
export const updateRole = (roles: IRole[]) => {
    const response = $api.put("/roles", { roles });
    return response;
};