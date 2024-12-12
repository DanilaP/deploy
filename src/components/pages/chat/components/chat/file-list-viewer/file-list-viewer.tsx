import './file-list-viewer.scss';
import { FaFile } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TextField } from '@mui/material';

export default function FileListViewer (props: { 
    fileList: File[], 
    deleteFile: (index: number) => void,
    setUserMessage: (str: string) => void
}) {

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
            <TextField onChange={ (e) => props.setUserMessage(e.target.value) } placeholder='Введите сообщение'></TextField>
        </div>
    );
}