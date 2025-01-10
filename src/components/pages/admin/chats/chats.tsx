import './chats.scss';
import $api from '../../../../configs/axiosconfig/axios';
import { useEffect, useState } from 'react';
import { IChat } from '../../../../interfaces/interfaces';
import { useStore } from '../../../../stores';
import { t } from 'i18next';
import Chat from '../../../partials/chat/components/chat/chat';
import AdminChats from './components/admin-chats.tsx/admin-chats';
import FreeChats from './components/free-chats.tsx/free-chats';

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
                            changeChatsInfo = { setAdminChats }
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