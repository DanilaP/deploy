import { useEffect, useRef } from 'react';
import { IMessage, IUser } from '../../../../interfaces/interfaces';
import './message-list.scss';

export default function MessageList (props: { messages: IMessage[], user: IUser }) {
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [props.messages]);
    
    return (
        <>
            {
                props.messages.map((message: IMessage, index: number) => {
                    return (
                        <div 
                            key={ message.text + index } 
                            className={ message.senderId === Number(props.user.id) ? "message user-msg" : "message opponent-msg" }>
                            <div className="text">{ message.text }</div>
                            <div className="date">{ message.date }</div>
                        </div>
                    );
                })
            }
            <div ref = { scrollRef }></div>
        </>
    );
}