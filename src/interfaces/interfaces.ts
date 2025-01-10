import { IProduct } from "../models/products/products.ts";

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

export interface ISelect {
    id: string,
    label: string
}
export interface IMessage {
    id: number,
    senderId: number,
    recipientId: number,
    date: string,
    text: string,
    files?: { url: string, size: number, name: string }[],
    reactions?: string,
    checked: boolean
}
export interface IChat {
    id: number,
    fixed: boolean,
    members: number[],
    messages: IMessage[]
}

export interface IAttachment {
    src: string,
    type: string
}

export interface ICartProduct {
    id: number;
    number: number;
    variation: string;
    productInfo: IProduct;
}

export type IAdditionalInfoFilterOptions = Record<string, { title: string, value: string}[]>;

export interface IOrdersStatisticInfo {
    averageTimeOfDeliveryHours: number,
    countOfOrders: number,
    courierCount: number,
    deliveredCount: number,
    inTransitCount: number,
    pickupCount: number,
    averageAmountOfOrder: number,
    amountPriceOfOrders: number,
    paymentsInfo: {
        [key: string]: { 
            count: number, 
            amount: number, 
            type: string 
        }
    },
    productsStats: {
        [key: string]: { 
            count: number, 
            amount: number, 
            name: string,
            images: string[],
            ordersCount: number,
            categories: string[]
        }
    }
}

export interface IProductCategoriesStatisticInfo {
    [categoryName: string]: {
        countOfOrders: number,
        amountOfOrders: number,
        categoryId: string,
        image: string
    }
}