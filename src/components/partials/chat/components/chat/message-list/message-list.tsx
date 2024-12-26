import { useEffect, useRef } from 'react';
import { IMessage } from '../../../../../../interfaces/interfaces';
import './message-list.scss';
import { IUser } from '../../../../../../models/user/user';
import { FaFile } from "react-icons/fa";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { BiSolidLike } from "react-icons/bi";

export default function MessageList (props: { 
    messages: IMessage[], 
    user: IUser, 
    opponentInfo: {
        id: number,
        avatar: string
    },
    changeMessageStatus: (messageBlock: Element) => void,
    changeMessageReaction: (message: IMessage) => void
}) {
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [props.messages]);

    useEffect(() => {
        if (containerRef) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        props.changeMessageStatus(entry.target);
                    }
                });
            });
        
            const messageDivs = containerRef?.current?.querySelectorAll('.opponent-msg');
            messageDivs!.forEach(div => {
                observer.observe(div);
            });
        }
    }, [props.messages]);

    return (
        <div ref = { containerRef } className="chat-content">
            {
                props.messages.map((message: IMessage, index: number) => {
                    return (
                        <div
                            id = { String(message.id) } 
                            key={ message.text + index } 
                            className={ message.senderId === Number(props.user.id) ? "message user-msg" : "message opponent-msg" }>
                                <div className="files">
                                    {
                                        message?.files?.map((file) => {
                                            return (
                                                <div key={ file.url } className="file">
                                                    <div className="image">
                                                        <FaFile className='icon' />
                                                    </div>
                                                    <a 
                                                        rel="noreferrer" 
                                                        target="_blank" 
                                                        href = { file.url } 
                                                        className="name">
                                                        { file.name }
                                                    </a>
                                                </div>  
                                            );
                                        }) 
                                    }
                                </div>
                                {   
                                    (message.text !== "") &&
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
                                }
                                <div className="date">
                                    { message.date }
                                    <div className="status">
                                        { 
                                            (message.checked || message.senderId !== Number(props.user.id)) 
                                                ?  <IoCheckmarkDoneOutline className='checked status-icon' /> 
                                                :  <IoCheckmarkOutline className='status-icon' /> 
                                        }
                                    </div>
                                    {
                                        (message.senderId !== Number(props.user.id)) &&
                                        <div className={
                                            message.reactions !== "" ? "active-reaction reaction" : "reaction"
                                        }>
                                            <BiSolidLike 
                                                onClick={ () => props.changeMessageReaction(message) }
                                                className={ message.reactions !== "" 
                                                    ? 'visible reaction-icon'
                                                    : 'reaction-icon'
                                                }
                                            />
                                        </div>
                                    }
                                </div>
                        </div>
                    );
                })
            }
            <div ref = { scrollRef }></div>
        </div>
    );
}
