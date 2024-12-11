import { useTranslation } from 'react-i18next';
import './chat.scss';
import { useStore } from '../../../../../stores';
import { useEffect, useState } from 'react';
import { IChat, IMessage } from '../../../../../interfaces/interfaces';
import { Button, TextField } from '@mui/material';
import MessageList from './message-list/message-list';
import { isDateWithin15Minutes, transformDateToString } from './chat-helpers/helpers';
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from '../../../../partials/emoji-picker/emoji-picker';

export default function Chat (props: { 
    close: () => void, 
    chatInfo: IChat | null, 
    opponentInfo: {
        id: number,
        avatar: string
    },
    updateChatData?: () => void 
}) {

    const { userStore } = useStore();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [userMessage, setUserMessage] = useState<string>("");
    const [chat, setChat] = useState<IChat | null>(props.chatInfo);
    const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
    const { t } = useTranslation();

    const openEmoji = () => {
        emojiOpen ? setEmojiOpen(false) : setEmojiOpen(true);
    };

    const addEmojiToMessage = (emoji: string) => {
        setUserMessage(userMessage + emoji);
    };

    const sendMessage = () => {
        let enableChat = true;
        if (chat && userStore.user?.role !== "Администратор" && chat.messages.length >= 15) {
            const last15Messages = chat?.messages.slice(-15);
            enableChat = last15Messages?.filter((msg: IMessage) => msg.senderId !== Number(userStore.user?.id)).length > 0;

            if (!enableChat) {
                enableChat = !isDateWithin15Minutes(chat?.messages[chat.messages.length - 1].date);
            }
        }
        
        if (enableChat && userMessage !== "") {
            const date = transformDateToString(Date.now());
            const messageData = {
                date: date,
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
                setChat(data);
                if (props.updateChatData) {
                    props.updateChatData();
                }
            };
            setSocket(updatedSocketConnection);
            userStore.setSocketConnection(updatedSocketConnection);
        }
    }, []);

    useEffect(() => {
        setChat(props.chatInfo);
    }, [props.chatInfo]);

    return (
        <div className='chat'>
            <div className="chat-header">
                <div onClick={ props.close } className="close-button">x</div>
            </div>
            <div className="chat-content">
                {
                    (chat && userStore.user) 
                        ? <MessageList opponentInfo = { props.opponentInfo } messages={ chat.messages } user={ userStore.user } />
                        : null
                }
            </div>
            <div className="chat-footer">
                <TextField 
                    value={ userMessage }
                    fullWidth 
                    onChange={ (e) => setUserMessage(e.target.value) } 
                    placeholder={ t("text.yourMessage") } 
                    className='item' 
                />
                <MdEmojiEmotions onClick={ openEmoji } className='emoji-icon' />
                <Button onClick={ sendMessage } className='item' variant='contained'>{ t("text.send") }</Button>
            </div>
            <div className="emoji-wrapper">
                { emojiOpen && <EmojiPicker updateInputString={ addEmojiToMessage } /> }
            </div>
        </div>
    );
}