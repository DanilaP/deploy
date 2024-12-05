import { IProduct } from "../models/products/products";

export interface IUser {
    id?: string,
    isActive?: boolean,
    isVerified?: boolean,
    country: string,
    city: string,
    login?: string,
    name: string,
    tel: string,
    password?: string,
    role?: string,
    avatar?: string,
    backet?: any[],
    favorites?: number[]
}
export interface IPermission {
    name: string,
    description: string
}
export interface IRole {
    name: string,
    permissions: string[]
}
export interface IPermissionGroup {
    name: string,
    permissions: string[]
}

export interface IAddress {
    id?: number;
    fullAddress: string;
    houseNumber?: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    intercom?: string;
    comment?: string;
}

export interface IStore {
    id: number,
    name: string,
    address: string,
    products: {
        productId: number,
        variation: string,
        number: number,
        productInfo: IProduct
    }[]
}
export interface ISelect {
    id: string,
    label: string
}
export interface IMessage {
    senderId: number,
    recipientId: number,
    date: string,
    text: string
}
export interface IChat {
    id: number,
    members: number[],
    messages: IMessage[]
}

export interface IAttachment {
    src: string,
    type: string
}
