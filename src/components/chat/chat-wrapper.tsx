import { Button } from '@mui/material';
import { useTranslation } from '../../translation/i18n';
import './chat-wrapper.scss';
import { useState } from 'react';
import Chat from './chat/chat';

export default function ChatWrapper () {

    const { t } = useTranslation();
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    
    return (
        <div className='chat-wrapper'>
            {
                isChatOpen 
                    ? <Chat close = { () => setIsChatOpen(false) } />
                    : <Button onClick={ () => setIsChatOpen(true) } variant='contained'>Чат</Button>
            }
        </div>
    );
}