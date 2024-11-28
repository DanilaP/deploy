import './chats.scss';
import $api from '../../../configs/axiosconfig/axios';
import { useEffect, useState } from 'react';
import { IChat } from '../../../interfaces/interfaces';
import { useStore } from '../../../stores';
import Chat from '../../chat/chat/chat';

export default function Chats () {
    
    const [adminChats, setAdminChats] = useState<any[]>();
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
            setAdminChats(res.data.detailedChatsInfo);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [currentChatInfo]);

    return (
        <div className="chats-wrapper">
            <div className="chat-list">
            <div className="chat-list-header">Ваши чаты</div>
                <div className="list">
                    {
                        adminChats?.map((chat: any) => {
                            if (chat.members.filter(user => user.id === userStore.user?.id).length > 0) {
                                return (
                                    <div onClick={ () => changeChat(chat) } key={ chat.id } className="chat-preview">
                                        { chat.messages[0].text }
                                    </div>
                                );
                            }
                        })
                    }
                </div>
                <div className="chat-list-header">Свободные чаты</div>
                <div className="list">
                    {
                        adminChats?.map((chat: any) => {
                            if (chat.members.length === 1) {
                                return (
                                    <div onClick={ () => changeChat(chat) } key={ chat.id } className="chat-preview">
                                        { chat.messages[0].text }
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </div>
            <div className="chat-info">
                { currentChatInfo && <Chat opponentInfo = { opponentInfo } chatInfo={ currentChatInfo } close = { () => setCurrentChatInfo(null) } /> }
            </div>
        </div>
    );
}