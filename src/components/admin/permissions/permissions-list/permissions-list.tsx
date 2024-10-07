import { useTranslation } from 'react-i18next';
import './permissions-list.scss';
import { IPermission, IPermissionGroup } from '../../../../interfaces/interfaces';
import { checkConcretePermissions } from '../../../../helpers/permissions-helpers';

export default function PermissionsList (props: { permissions: IPermission[], dragStart: (element: any, from: IPermissionGroup | null) => void, 
    dragEnd: () => void, dragOver: (element: any) => void }) {

    const { t } = useTranslation();
    const permissionsExists = checkConcretePermissions();
    
    return (
        <div onDragOver={ () => props.dragOver(null) } className='permissions-list-main'>
            {
                props.permissions.map((permission: IPermission) => {
                    return (
                        <div onDragEnd={ () => props.dragEnd() } 
                            onDragStart={ () => props.dragStart(permission.name, null) } 
                            draggable = { permissionsExists.ModifyGroupOfPermissions }
                            key={ permission.name } 
                            className='permission'>
                            <div className="permission-name">
                                { t("permissions." + permission.name) }
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}