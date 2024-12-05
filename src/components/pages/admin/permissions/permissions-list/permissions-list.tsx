import { useTranslation } from 'react-i18next';
import './permissions-list.scss';
import { IPermission, IPermissionGroup } from '../../../../../interfaces/interfaces.ts';
import Permission from '../permission-component/permission.tsx';
import usePermissions from "../../../../../helpers/permissions-helpers.ts";

export default function PermissionsList (props: {
    permissions: IPermission[],
    dragStart: (element: any, from: IPermissionGroup | null) => void,
    dragEnter: (element: any) => void,
    dragEnterPermission: (permission: string) => void,
    permissionsGroups: IPermissionGroup[],
}) {

    const { t } = useTranslation();

    const { checkConcretePermissions } = usePermissions();
    const permissionsExists = checkConcretePermissions();

    const upwrappedPermissions = props.permissionsGroups.reduce((prev: string[], group: IPermissionGroup) => {
        return [...prev, ...group.permissions];
    }, []);

    return (
        <div onDragEnter={ () => props.dragEnter(null) } className='permissions-list-main'>
            {
                props.permissions.map((permission: IPermission) => {
                    const translate = t(`permissions.${permission.name}`);
                    if (!upwrappedPermissions.includes(permission.name)) {
                        return (
                            <Permission
                                dragEnterPermission = { () => props.dragEnterPermission(permission.name) }
                                permissionsExists = { permissionsExists }
                                name = { translate }
                                dragStart={ () => props.dragStart(permission.name, null) }
                                key={ permission.name }
                            />
                        );
                    }
                })
            }
        </div>
    );
}
