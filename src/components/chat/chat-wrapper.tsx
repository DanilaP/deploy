import { Button } from '@mui/material';
import { useTranslation } from '../../translation/i18n';
import './chat-wrapper.scss';
import { useEffect, useState } from 'react';
import Chat from './chat/chat';
import $api from '../../configs/axiosconfig/axios';
import { IChat } from '../../interfaces/interfaces';

export default function ChatWrapper () {

    const { t } = useTranslation();
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [chat, setChat] = useState<IChat | null>(null);
    const [opponentInfo, setOpponentInfo] = useState<{ id: number, avatar: string }>({ id: 0, avatar: "" });

    useEffect(() => {
        $api.get("/chats")
        .then((res) => {
            setChat(res.data.chats[0]);
            setOpponentInfo(res.data.opponentInfo);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [isChatOpen]);
    
    return (
        <div className='chat-wrapper'>
            {
                isChatOpen 
                    ? <Chat opponentInfo = { opponentInfo } chatInfo = { chat } close = { () => setIsChatOpen(false) } />
                    : <Button onClick={ () => setIsChatOpen(true) } variant='contained'>Чат</Button>
            }
        </div>
    );
}