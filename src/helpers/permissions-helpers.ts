import { IPermission } from "../interfaces/interfaces";
import { useStore } from "../stores";

const usePermissions = () => {
    const { userStore } = useStore();

    const checkPermissions = () => {
        return userStore.permissions.length > 0;
    };

    const checkConcretePermissions = () => {
        const currentPermissions = userStore.permissions;
        const allPermissions = userStore.allPermissions;

        const permissionsExists = allPermissions.reduce((prev: Record<string, boolean>, perm: IPermission) => {
            return { ...prev, [perm.name]: currentPermissions.includes(perm.name) };
        }, {});

        return permissionsExists;
    };

    return { checkPermissions, checkConcretePermissions };
};

export default usePermissions;

