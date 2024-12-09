import { Tooltip } from "@mui/material";
import { IAttachment } from "../../../interfaces/interfaces";
import "./file-attachment.scss";

interface IFileAttachmentProps {
    attachment: IAttachment
}

export default function FileAttachment({
    attachment
}: IFileAttachmentProps) {
    return (
        <div className="file-attachment">
            <div className="attachment-wrapper" key={ attachment.src }>
                {
                    attachment.type.includes("image") &&
                        <Tooltip
                            placement="top"
                            title={
                                <img
                                    src={ attachment.src } 
                                    width="300px" 
                                    height="200px" 
                                />
                            }
                        >
                            <a href={ attachment.src } target="__blank">
                                <img
                                    className="attachment-image"
                                    src={ attachment.src }
                                />
                            </a>
                        </Tooltip>
                }
                {
                    attachment.type.includes("video") &&
                        <Tooltip
                            placement="top"
                            title={
                                <video
                                    controls
                                    className="attachment-video-tooltip"
                                    src={ attachment.src } 
                                />
                            }
                        >
                            <a href={ attachment.src } target="__blank">
                                <video 
                                    className="attachment-video"
                                    src={ attachment.src } 
                                />
                            </a>
                        </Tooltip>
                }
            </div>
        </div>
    );
}