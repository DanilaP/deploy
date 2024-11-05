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