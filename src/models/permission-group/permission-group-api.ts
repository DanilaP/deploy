import $api from '../../configs/axiosconfig/axios.js';
import { IPermissionGroup } from './permission-group.js';

export const getPermissionGroups = () => {
    const response = $api.get("/permissions/groups");
    return response;
};
export const createPermissionGroup = (name: string) => {
    const response = $api.post("/permissions/groups", { name: name });
    return response;
};
export const deletePermissionGroup = (name: string) => {
    const response = $api.delete(`/permissions/groups?name=${ name }`);
    return response;
};
export const updatePermissionGroups = (permissionsGroups: IPermissionGroup[]) => {
    const response = $api.put("/permissions/groups", { permissionsGroups: permissionsGroups });
    return response;
};