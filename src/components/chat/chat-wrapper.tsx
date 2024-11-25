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
    const [chat, setChat] = useState<IChat>();

    useEffect(() => {
        $api.get("/chats")
        .then((res) => {
            setChat(res.data.chats[0]);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [isChatOpen]);
    
    return (
        <div className='chat-wrapper'>
            {
                isChatOpen && chat 
                    ? <Chat chatInfo = { chat } close = { () => setIsChatOpen(false) } />
                    : <Button onClick={ () => setIsChatOpen(true) } variant='contained'>Чат</Button>
            }
        </div>
    );
}