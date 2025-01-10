import { IAttachment } from "../../interfaces/interfaces";

export interface IFeedBack {
    id: number,
    userId: number,
    firstName: string,
    secondName: string,
    phoneNumber: string,
    description: string,
    typeOfBid: string,
    email: string,
    solved: boolean,
    moderatorAnswer: string | null,
    createdAt: string,
    dateOfAnswer: string | null,
    attachments: IAttachment[],
    parentFeedbackId?: number | null
}

export interface IFeedbackType {
    id: number,
    systemKey: string
}