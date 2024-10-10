import { useTranslation } from 'react-i18next';
import './permissions-group-list.scss';
import { IPermissionGroup } from '../../../../interfaces/interfaces';
import Permission from '../permission-component/permission';

export default function PermissionsGroupList (props: { permissionsGroups: IPermissionGroup[], 
    deleteGroup: (group: IPermissionGroup) => void, dragStart: (element: any, from: IPermissionGroup | null) => void, 
    dragEnd: () => void, dragOver: (element: any) => void, deletePermission: (permissionName: string, groupName: string) => void }) {

    const { t } = useTranslation();

    const startDeletingGroup = (deletedGroup: IPermissionGroup) => {
        props.deleteGroup(deletedGroup);
    };

    return (
        <div className='permissions-group-list-main'>
            {
                props.permissionsGroups.map((permissionGroup: IPermissionGroup) => {
                    return (
                        <div onDragOver={ () => props.dragOver(permissionGroup) } key={ permissionGroup.name } className='permission-group'>
                            <div className="permission-group-name">
                                { permissionGroup.name }
                                <div onClick={ () => startDeletingGroup(permissionGroup) } className="delete-button">{ t("text.deleteGroup") }</div>
                            </div>
                            <div className="permission-group-permissions">
                                {
                                    permissionGroup.permissions.map((permission: string) => {
                                        const translate = t(`permissions.${permission}`);
                                        return (
                                            <Permission 
                                                name = { translate }
                                                dragEnd={ () => props.dragEnd() } 
                                                dragStart={ () => props.dragStart(permission, permissionGroup) }
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
        </div>
    );
}