import './file-list-viewer.scss';
import { FaFile } from "react-icons/fa";
import { MdDelete, MdEmojiEmotions } from "react-icons/md";
import { TextField } from '@mui/material';
import EmojiPicker from '../../../../../partials/emoji-picker/emoji-picker';
import { useState } from 'react';

export default function FileListViewer (props: { 
    fileList: File[], 
    deleteFile: (index: number) => void,
    setUserMessage: (str: string) => void
    addEmojiToMessage: (str: string) => void,
    currentUserMessage: string
}) {

    const [emojiOpen, setEmojiOpen] = useState<boolean>(false);

    const openEmoji = () => {
        emojiOpen ? setEmojiOpen(false) : setEmojiOpen(true);
    };

    return (
        <div className="file-list-viewer">
            <div className="file-list">
                {
                    props.fileList.map((file, index) => {
                        return (
                            <div key={ file.name + file.size + file.type } className="file">
                                <FaFile className='file-icon' />
                                { file.name }
                                <div className="remove-file-button">
                                    <MdDelete onClick={ () => props.deleteFile(index) } />
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className="settings">
                <div className="emoji-wrapper">
                    { emojiOpen && <EmojiPicker updateInputString={ props.addEmojiToMessage } /> }
                </div>
                <TextField
                    fullWidth
                    value={ props.currentUserMessage } 
                    onChange={ (e) => props.setUserMessage(e.target.value) } 
                    placeholder='Введите сообщение'>
                </TextField>
                <MdEmojiEmotions onClick={ openEmoji } className='emoji-icon' />
            </div>
        </div>
    );
}