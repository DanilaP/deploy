import { useTranslation } from 'react-i18next';
import './permissions-group-list.scss';
import { IPermissionGroup } from '../../../../interfaces/interfaces';
import { checkConcretePermissions } from '../../../../helpers/permissions-helpers';

export default function PermissionsGroupList (props: { permissionsGroups: IPermissionGroup[], 
    deleteGroup: (group: IPermissionGroup) => void, dragStart: (element: any, from: IPermissionGroup | null) => void, 
    dragEnd: () => void, dragOver: (element: any) => void, deletePermission: (permissionName: string, groupName: string) => void }) {

    const { t } = useTranslation();
    const permissionsExists = checkConcretePermissions();
    
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
                                {
                                    permissionsExists.DeleteGroupOfPermissions ? 
                                    <div onClick={ () => startDeletingGroup(permissionGroup) } className="delete-button">
                                        { t("text.deleteGroup") }
                                    </div> : null
                                }
                            </div>
                            <div className="permission-group-permissions">
                                {
                                    permissionGroup.permissions.map((permission: string) => {
                                        return (
                                            <div onDragEnd={ () => props.dragEnd() } onDragStart={ () => props.dragStart(permission, permissionGroup) } 
                                                draggable = { permissionsExists.ModifyGroupOfPermissions }
                                                key={ permission } 
                                                className='permission'>
                                                <div className="permission-name">{ t("permissions." + permission) }</div>
                                                {
                                                    permissionsExists.DeleteGroupOfPermissions ? 
                                                    <div onClick={ () => props.deletePermission(permission, permissionGroup.name) } className="delete-button">
                                                        x
                                                    </div> : null
                                                }
                                            </div>
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