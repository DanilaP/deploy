import { useTranslation } from 'react-i18next';
import './permissions-group-list.scss';
import { IPermissionGroup } from '../../../../interfaces/interfaces';
import Permission from '../permission-component/permission';
import Masonry from '@mui/lab/Masonry';
import usePermissions from "../../../../helpers/permissions-helpers.ts";

export default function PermissionsGroupList (props: {
    permissionsGroups: IPermissionGroup[],
    deleteGroup: (group: IPermissionGroup) => void,
    dragStart: (element: any, from: IPermissionGroup | null) => void,
    dragEnter: (element: any) => void,
    deletePermission: (permissionName: string, groupName: string) => void,
    dragEnterPermission: (permission: string) => void,
}) {

    const { t } = useTranslation();

    const { checkConcretePermissions } = usePermissions();
    const permissionsExists = checkConcretePermissions();
    const startDeletingGroup = (deletedGroup: IPermissionGroup) => {
        props.deleteGroup(deletedGroup);
    };

    return (
        <div className='permisisons-groups-list-main'>
            <Masonry sequential={ true } columns={2}>
                {
                    props.permissionsGroups.map((permissionGroup: IPermissionGroup) => {
                        return (
                            <div
                                onDragEnter={ () => props.dragEnter(permissionGroup) }
                                key={ permissionGroup.name }
                                className='permission-group'
                            >
                                <div className="permission-group-name">
                                    { permissionGroup.name }
                                    {
                                        permissionsExists.DeleteGroupOfPermissions ?
                                        <div onClick={ () => startDeletingGroup(permissionGroup) } className="delete-button">
                                            x
                                        </div> : null
                                    }
                                </div>
                                <div className="permission-group-permissions">
                                    {
                                        permissionGroup.permissions.map((permission: string) => {
                                            const translate = t(`permissions.${permission}`);
                                            return (
                                                <Permission
                                                    dragEnterPermission = { () => props.dragEnterPermission(permission) }
                                                    name = { translate }
                                                    dragStart={ () => props.dragStart(permission, permissionGroup) }
                                                    permissionsExists = { permissionsExists }
                                                    key={ permission }
                                                    isDelete = { () => props.deletePermission(permission, permissionGroup.name) }
                                                />
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </Masonry>
        </div>
    );
}
