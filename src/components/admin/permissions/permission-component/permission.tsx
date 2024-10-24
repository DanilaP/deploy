import { useDispatch, useSelector } from "react-redux";
import "./permission.scss";
import { useRef } from "react";

export default function Permission (props: { 
    name: string,
    dragStart: () => void, 
    isDelete?: () => void,
    permissionsExists: any,
    dragEnterPermission: () => void,
}) {
    const draggablePermission = useSelector((store: any) => store.draggablePermission);
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);
    
    const handleDragEnd = () => {
        dispatch({ type: "SET_DRAGGABLE_PERMISSION", payload: null });
        ref.current?.removeEventListener("dragend", handleDragEnd);
    };

    const handleDragStart = () => {
        props.dragStart();
        dispatch({ type: "SET_DRAGGABLE_PERMISSION", payload: props.name });
        ref.current?.addEventListener("dragend", handleDragEnd);
    };

    return (
        <div
            ref={ref}
            onDragEnter={ props.dragEnterPermission }
            draggable = { props.permissionsExists.ModifyGroupOfPermissions } 
            onDragStart={ handleDragStart }
            className='permission'
            style={draggablePermission === props.name ? { border: "1px solid #1976d2" } : { border: "1px solid rgba(128, 128, 128, 0.247)" }}
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
