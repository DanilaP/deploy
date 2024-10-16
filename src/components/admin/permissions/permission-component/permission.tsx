import "./permission.scss";

export default function Permission (props: { 
    name: string,
    dragStart: () => void, 
    isDelete?: () => void,
    permissionsExists: any,
    dragEnterPermission: () => void
}) {

    return (
        <div 
            onDragEnter={ props.dragEnterPermission }
            draggable = { props.permissionsExists.ModifyGroupOfPermissions } 
            onDragStart={ props.dragStart }
            className='permission'
        >
            <div className="permission-name">
                { props.name }
            </div>
            {
                (props.isDelete && props.permissionsExists.ModifyGroupOfPermissions) && 
                    <div onClick={ props.isDelete } className="delete-button">x</div>
            }
        </div>
    );
}
