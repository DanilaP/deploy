
export default function Permission (props: { name: string }) {

    return (
        <div className="permission-name">
            { props.name }
        </div>
    );
}