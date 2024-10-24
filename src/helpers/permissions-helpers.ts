import { IPermission } from "../interfaces/interfaces";
import { store } from "../store";

export const checkPermissions = () => {
    const flag = store.getState().permissions.length > 0 ? true : false;
    return flag;
};

export const checkConcretePermissions = () => {
    const currentPermissions = store.getState().permissions;
    const allPermissions = store.getState().allPermissions;

    const permissionsExists = allPermissions.reduce((prev: Record<string, boolean>, perm: IPermission) => {
        return { ...prev, [perm.name]: currentPermissions.includes(perm.name) };
    }, {});

    return permissionsExists;
};