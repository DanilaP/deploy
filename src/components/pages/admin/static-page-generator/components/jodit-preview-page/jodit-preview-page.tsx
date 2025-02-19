import { IconButton } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import "./jodit-preview-page.scss";

interface IJoditPreviewPageProps {
    content: string,
    handleClosePreview: () => void
}

export default function JoditPreviewPage({ content, handleClosePreview }: IJoditPreviewPageProps) {
    return (
        <div className="jodit-preview-page">
            <div 
                dangerouslySetInnerHTML={ { __html: content } }
                className="jodit-wysiwyg jodit-editor-preview"
            >
            </div>
            <IconButton
                className="jodit-editor-preview-close"
                onClick={ handleClosePreview }
            >
                <MdOutlineClose  fontSize={ 25 } />
            </IconButton>
        </div>
    );
}