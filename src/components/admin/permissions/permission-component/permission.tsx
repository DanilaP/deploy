export default function Permission (props: { 
    name: string,
    dragStart: () => void, 
    dragEnd: () => void,
    isDelete?: () => void
}) {
    
    return (
        <div draggable onDragEnd={ props.dragEnd } onDragStart={ props.dragStart } className='permission'>
            <div className="permission-name">
                { props.name }
            </div>
            {
                props.isDelete && <div onClick={ props.isDelete } className="delete-button">x</div>
            }
        </div>
    );
}