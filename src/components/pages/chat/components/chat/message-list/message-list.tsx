import { useEffect, useRef } from 'react';
import { IMessage } from '../../../../../../interfaces/interfaces';
import './message-list.scss';
import { IUser } from '../../../../../../models/user/user';

export default function MessageList (props: { messages: IMessage[], user: IUser, opponentInfo: {
    id: number,
    avatar: string
} }) {
    
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
                                <div className="text">
                                    <div className="image-wrapper">
                                        <img className='image' src = {
                                            message.senderId === Number(props.user.id) 
                                                ? props.user.avatar
                                                : props.opponentInfo.avatar
                                        } />
                                    </div>
                                    <div>{ message.text }</div>
                                </div>
                                <div className="date">{ message.date }</div>
                        </div>
                    );
                })
            }
            <div ref = { scrollRef }></div>
        </>
    );
}
