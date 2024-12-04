import { IAttachment } from "../interfaces/interfaces";

export const convertFileListToBlobArray = (fileList: any) => {
    let blobArray: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
        if (typeof fileList[i] !== "string") {
            blobArray = [...blobArray, URL.createObjectURL(fileList[i])];
        } else {
            blobArray = fileList;
        }
    }

    return blobArray;
};

export const convertFileListToAttachmentsFormatBlobArray = (fileList: any) => {
    let attachments: IAttachment[] = [];

    for (let i = 0; i < fileList.length; i++) {
        if (typeof fileList[i] !== "string") {
            attachments = [
                ...attachments, 
                { 
                    type: fileList[i].type, 
                    src: URL.createObjectURL(fileList[i]) 
                }
            ];
        } else {
            attachments = fileList;
        }
    }

    return attachments;
};