import { IProduct } from "../models/products/products";

export interface IPermission {
    name: string,
    description: string
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

export interface IPrevDelivery {
    id: number,
    wareHouseId: number | null,
    address: IAddress | null,
    timeStamp: string,
    type: string,
    payment: {
        method: string,
        timeStamp: string,
    },
    comment: string,
}

export interface IDeliveryData {
    userId: number,
    prevDeliveries: IPrevDelivery[],
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

export interface IOrder {
    orderId: number;
    userId: number;
    orderNumber: number;
    orderStatus: "waiting" | "delivered" | "in-transit" | "cancelled" | string;
    createdAt: string;
    deliveredAt?: string;
    estimatedDeliveryDate?: string;
    paymentMethod: "card" | "cash" | "spb" | string;
    deliveryMethod: "courier" | "pickup" | "other" | string;
    address: IAddress;
    orderPrice: number;
    products: {
        id: number;
        amount: number;
        variation: string;
    }[];
}