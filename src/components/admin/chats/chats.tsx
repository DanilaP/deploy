import './chats.scss';
import $api from '../../../configs/axiosconfig/axios';
import { useEffect, useState } from 'react';
import { IChat } from '../../../interfaces/interfaces';
import { useStore } from '../../../stores';

export default function Chats () {
    
    const [adminChats, setAdminChats] = useState<IChat[]>();
    const [currentChatInfo, setCurrentChatInfo] = useState<IChat | null>(null);
    const { userStore } = useStore();
    
    useEffect(() => {
        $api.get("/chats")
        .then((res) => {
            const filteredChats = res.data.chats.filter((chat: IChat) => {
                if (chat.messages[0].senderId !== Number(userStore.user?.id)) {
                    return true;
                } return false;
            });
            setAdminChats(filteredChats);
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
                            <div onClick={ () => setCurrentChatInfo(chat) } key={ chat.id } className="chat-preview">
                                { chat.messages[0].text }
                            </div>
                        );
                    })
                }
            </div>
            <div className="chat-info">
                
            </div>
        </div>
    );
}