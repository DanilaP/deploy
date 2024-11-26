import { useTranslation } from 'react-i18next';
import './chat.scss';
import { useStore } from '../../../stores';
import { useEffect, useState } from 'react';
import { IChat } from '../../../interfaces/interfaces';
import { Button, TextField } from '@mui/material';
import MessageList from './message-list/message-list';

export default function Chat (props: { close: () => void, chatInfo: IChat | null }) {

    const { userStore } = useStore();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [userMessage, setUserMessage] = useState<string>("");
    const [chat, setChat] = useState<IChat | null>(props.chatInfo);
    const { t } = useTranslation();
    
    const sendMessage = () => {
        if (userMessage !== "") {
            const messageData = {
                senderToken: sessionStorage.getItem("token"),
                recipientId: chat?.members.filter((memberId: number) => memberId !== Number(userStore.user?.id))[0],
                message: userMessage,
            };
            socket?.send(JSON.stringify(messageData));
        }
    };

    useEffect(() => {
        if (userStore.socketConnection) {
            const updatedSocketConnection = userStore.socketConnection;
            updatedSocketConnection.onmessage = function(event) {
                const data = JSON.parse(event.data);
                setChat((prev) => {
                    return {
                        ...prev,
                        messages: data
                    };
                });
            };
            setSocket(updatedSocketConnection);
            userStore.setSocketConnection(updatedSocketConnection);
        }
    }, []);

    return (
        <div className='chat'>
            <div className="chat-header">
                <div onClick={ props.close } className="close-button">x</div>
            </div>
            <div className="chat-content">
                {
                    (chat && userStore.user) 
                        ? <MessageList messages={ chat.messages } user={ userStore.user } />
                        : null
                }
            </div>
            <div className="chat-footer">
                <TextField onChange={ (e) => setUserMessage(e.target.value) } placeholder='Ваше сообщение' className='item' />
                <Button onClick={ sendMessage } className='item' variant='contained'>Отправить</Button>
            </div>
        </div>
    );
}