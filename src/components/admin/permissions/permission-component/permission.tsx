import { useRef } from "react";
import "./permission.scss";

export default function Permission (props: { 
    name: string,
    dragStart: () => void, 
    dragEnd: () => void,
    isDelete?: () => void,
    permissionsExists: any,
    dragOverPermission: () => void
}) {

    const ref = useRef<any>();
    
    const changeStylesOfPermission = () => {
        ref.current.style.border = "1px solid #1976d2";
        props.dragOverPermission();
    };

    return (
        <div 
            onDragLeave={ () => ref.current.style.border = "1px solid rgba(128, 128, 128, 0.247)" }
            onDragOver={ changeStylesOfPermission }
            draggable = { props.permissionsExists.ModifyGroupOfPermissions } 
            onDragEnd={ props.dragEnd } 
            onDragStart={ props.dragStart } 
            className='permission'
            ref = { ref }
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
