import { IMessage, IUser } from '../../../../interfaces/interfaces';
import './message-list.scss';

export default function MessageList (props: { messages: IMessage[], user: IUser }) {
    
    return (
        <>
            {
                props.messages.map((message: IMessage, index: number) => {
                    return (
                        <div 
                            key={ message.text + index } 
                            className={ message.senderId === Number(props.user.id) ? "message user" : "message opponent" }>
                            <div className="text">{ message.text }</div>
                        </div>
                    );
                })
            }
        </>
    );
}