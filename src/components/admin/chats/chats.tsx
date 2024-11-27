import './chats.scss';
import $api from '../../../configs/axiosconfig/axios';
import { useEffect, useState } from 'react';
import { IChat } from '../../../interfaces/interfaces';
import { useStore } from '../../../stores';
import Chat from '../../chat/chat/chat';

export default function Chats () {
    
    const [adminChats, setAdminChats] = useState<IChat[]>();
    const [currentChatInfo, setCurrentChatInfo] = useState<IChat | null>(null);
    const [opponentInfo, setOpponentInfo] = useState<{ id: number, avatar: string }>({ id: 0, avatar: "" });
    const { userStore } = useStore();
    
    const changeChat = (chat: IChat) => {
        $api.post("/admin/chat", chat)
        .then((res) => {
            setCurrentChatInfo(res.data.chat);
            setOpponentInfo(res.data.opponentInfo);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        $api.get("/admin/chats")
        .then((res) => {
            setAdminChats(res.data.chats);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className="chats-wrapper">
            <div className="chat-list">
                {
                    adminChats?.map((chat: IChat) => {
                        return (
                            <div onClick={ () => changeChat(chat) } key={ chat.id } className="chat-preview">
                                { chat.messages[0].text }
                            </div>
                        );
                    })
                }
            </div>
            <div className="chat-info">
                { currentChatInfo && <Chat opponentInfo = { opponentInfo } chatInfo={ currentChatInfo } close = { () => setCurrentChatInfo(null) } /> }
            </div>
        </div>
    );
}