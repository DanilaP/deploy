import { useTranslation } from 'react-i18next';
import './permissions-list.scss';
import { IPermission, IPermissionGroup } from '../../../../interfaces/interfaces';
import Permission from '../permission-component/permission';

export default function PermissionsList (props: { permissions: IPermission[], dragStart: (element: any, from: IPermissionGroup | null) => void, 
    dragEnd: () => void, dragOver: (element: any) => void }) {

    const { t } = useTranslation();

    return (
        <div onDragOver={ () => props.dragOver(null) } className='permissions-list-main'>
            {
                props.permissions.map((permission: IPermission) => {
                    return (
                        <div onDragEnd={ () => props.dragEnd() } onDragStart={ () => props.dragStart(permission.name, null) } draggable key={ permission.name } className='permission'>
                            <Permission name = { t("permissions." + permission.name) } />
                        </div>
                    );
                })
            }
        </div>
    );
}