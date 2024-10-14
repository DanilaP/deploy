import { useTranslation } from 'react-i18next';
import './permissions-group-list.scss';
import { IPermissionGroup } from '../../../../interfaces/interfaces';
import { checkConcretePermissions } from '../../../../helpers/permissions-helpers';
import Permission from '../permission-component/permission';
import Masonry from '@mui/lab/Masonry';

export default function PermissionsGroupList (props: { 
    permissionsGroups: IPermissionGroup[], 
    deleteGroup: (group: IPermissionGroup) => void, 
    dragStart: (element: any, from: IPermissionGroup | null) => void, 
    dragEnd: () => void, 
    dragOver: (element: any) => void, 
    deletePermission: (permissionName: string, groupName: string) => void,
    dragOverPermission: (permission: string) => void,
}) {

    const { t } = useTranslation();
    const permissionsExists = checkConcretePermissions();
    
    const startDeletingGroup = (deletedGroup: IPermissionGroup) => {
        props.deleteGroup(deletedGroup);
    };
    
    return (
        <div className='permisisons-groups-list-main'>
            <Masonry columns={2}>
                {
                    props.permissionsGroups.map((permissionGroup: IPermissionGroup) => {
                        return (
                            <div onDragOver={ () => props.dragOver(permissionGroup) } key={ permissionGroup.name } className='permission-group'>
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
                                                    dragOverPermission = { () => props.dragOverPermission(permission) } 
                                                    name = { translate }
                                                    dragEnd={ () => props.dragEnd() } 
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