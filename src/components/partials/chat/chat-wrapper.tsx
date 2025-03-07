import { Button } from '@mui/material';
import { useTranslation } from '../../../translation/i18n';
import './chat-wrapper.scss';
import { useEffect, useState } from 'react';
import $api from '../../../configs/axiosconfig/axios';
import { useStore } from '../../../stores';
import Chat from './components/chat/chat';

export default function ChatWrapper () {

    const { t } = useTranslation();
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [opponentInfo, setOpponentInfo] = useState<{ id: number, avatar: string }>({ id: 0, avatar: "" });
    const { userStore } = useStore();

    const getChatData = () => {
        $api.get("/chats")
        .then((res) => {
            userStore.setChatInfo(res.data.chats[0]);
            setOpponentInfo(res.data.opponentInfo);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
        getChatData();
        userStore.setIsChatOpen(isChatOpen);
    }, [isChatOpen]);
    
    return (
        <div className='chat-wrapper'>
            {
                isChatOpen 
                    ? <Chat updateChatData = { getChatData } opponentInfo = { opponentInfo } chatInfo = { userStore.chatInfo } close = { () => setIsChatOpen(false) } />
                    : <Button onClick={ () => setIsChatOpen(true) } variant='contained'>{ t("text.chat") }</Button>
            }
        </div>
    );
}