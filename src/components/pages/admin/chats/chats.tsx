import './chats.scss';
import $api from '../../../../configs/axiosconfig/axios';
import { useEffect, useState } from 'react';
import { IChat } from '../../../../interfaces/interfaces';
import { useStore } from '../../../../stores';
import Chat from '../../chat/chat/chat';
import FreeChats from './free-chats.tsx/free-chats';
import AdminChats from './admin-chats.tsx/admin-chats';
import { t } from 'i18next';

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
        if (currentChatInfo === null) {
            userStore.setIsChatOpen(false);
        } else {
            userStore.setIsChatOpen(true);
        }
    }, [currentChatInfo]);

    return (
        <div className="chats-wrapper">
            <div className="chat-list">
            <div className="chat-list-header">{ t("text.yourChats") }</div>
                <div className="list">
                    { (adminChats && userStore.user) && 
                        <AdminChats 
                            changeChat={ changeChat } 
                            user={ userStore.user } 
                            chats={ adminChats } 
                        /> 
                    }
                </div>
                <div className="chat-list-header">{ t("text.freeChats") }</div>
                <div className="list">
                    { adminChats && <FreeChats changeChat={ changeChat } chats={ adminChats } /> }
                </div>
            </div>
            <div className="chat-info">
                { currentChatInfo && 
                    <Chat 
                        opponentInfo = { opponentInfo } 
                        chatInfo={ currentChatInfo } 
                        close = { () => setCurrentChatInfo(null) } 
                    /> 
                }
            </div>
        </div>
    );
}