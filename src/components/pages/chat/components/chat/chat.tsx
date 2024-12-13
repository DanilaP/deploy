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
import { FiPaperclip } from "react-icons/fi";
import CustomModal from '../../../../components-ui/custom-modal/custom-modal';
import FileListViewer from './file-list-viewer/file-list-viewer';
import $api from '../../../../../configs/axiosconfig/axios';

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
    const [userFiles, setUserFiles] = useState<File[] | null>([]);
    const { t } = useTranslation();

    const openEmoji = () => {
        emojiOpen ? setEmojiOpen(false) : setEmojiOpen(true);
    };

    const addEmojiToMessage = (emoji: string) => {
        setUserMessage(userMessage + emoji);
    };

    const handleFileChange = (fileList: FileList | null) => {
        if (fileList) {
            const files = Array.from(fileList); 
            setUserFiles(files);
        }
    };

    const deleteFile = (index: number) => {
        if (userFiles) {
            setUserFiles(() => userFiles?.filter((file: File, fileIndex: number) => fileIndex !== index));
        }
    };

    const uploadFiles = async () => {
        if (userFiles && userFiles?.length > 0) {
            const formData = new FormData();
            userFiles?.forEach(file => {
                formData.append('files', file);
            });

            const files = await $api.post('/upload', formData);
            return files.data.files;

        } else return [];
    };

    const sendMessage = async () => {
        let enableChat = true;
        if (chat && userStore.user?.role !== "Администратор" && chat.messages.length >= 15) {
            const last15Messages = chat?.messages.slice(-15);
            enableChat = last15Messages?.filter((msg: IMessage) => msg.senderId !== Number(userStore.user?.id)).length > 0;

            if (!enableChat) {
                enableChat = !isDateWithin15Minutes(chat?.messages[chat.messages.length - 1].date);
            }
        }
        
        if (enableChat && userMessage !== "") { 
            const files = await uploadFiles();
            const date = transformDateToString(Date.now());
            const messageData = {
                date: date,
                senderToken: sessionStorage.getItem("token"),
                recipientId: chat?.members.filter((memberId: number) => memberId !== Number(userStore.user?.id))[0],
                message: userMessage,
                files: files
            };
            console.log(messageData);
            //socket?.send(JSON.stringify(messageData));
            setUserMessage("");
            setUserFiles([]);
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
                <Button
                    className='file-input-button'
                    variant="outlined"
                    component="label"
                >
                    <FiPaperclip className='file-input-icon' />
                    <input
                        multiple
                        onChange={ (e) => handleFileChange(e.target.files) }
                        type="file"
                        hidden
                    />
                </Button>
                <Button onClick={ sendMessage } className='item' variant='contained'>{ t("text.send") }</Button>
            </div>
            <div className="emoji-wrapper">
                { emojiOpen && <EmojiPicker updateInputString={ addEmojiToMessage } /> }
            </div>
            {
                userFiles && 
                <CustomModal
                    isDisplay = { userFiles?.length > 0 }
                    closeModal = { () => setUserFiles(null) }
                    title = "Загрузка файлов"
                    typeOfActions='default'
                    actionConfirmed={ sendMessage }
                >
                    <FileListViewer 
                        addEmojiToMessage = { addEmojiToMessage }
                        currentUserMessage= { userMessage }
                        setUserMessage = { setUserMessage } 
                        deleteFile={ deleteFile } 
                        fileList={ userFiles } 
                    />
                </CustomModal>
            }
        </div>
    );
}