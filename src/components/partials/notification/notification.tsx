import './notification.scss';

export default function Notification (props: { notification: { text: string, senderId: number } }) {
    
    return (
        <div className='notification'>
            { props.notification.text }
        </div>
    );
}