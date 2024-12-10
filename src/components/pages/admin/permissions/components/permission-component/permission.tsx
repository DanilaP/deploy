import "./permission.scss";
import { useRef } from "react";
import { useStore } from "../../../../../../stores";

export default function Permission (props: {
    name: string,
    dragStart: () => void,
    isDelete?: () => void,
    permissionsExists: any,
    dragEnterPermission: () => void,
}) {

    const ref = useRef<HTMLDivElement>(null);

    const { userStore } = useStore();
    const draggablePermission = userStore.draggablePermission;

    const handleDragEnd = () => {
        userStore.setDraggablePermission(null);
        ref.current?.removeEventListener("dragend", handleDragEnd);
    };

    const handleDragStart = () => {
        props.dragStart();
        userStore.setDraggablePermission(null);
        ref.current?.addEventListener("dragend", handleDragEnd);
    };

    return (
        <div
            ref={ ref }
            onDragEnter={ props.dragEnterPermission }
            draggable = { props.permissionsExists.ModifyGroupOfPermissions }
            onDragStart={ handleDragStart }
            className= {
                draggablePermission === props.name
                ? `permission active`
                : `permission inactive`
            }
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
