export interface IUser {
    id?: string,
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
export interface IProduct {
    id?: number,
    partNumber: string,
    name: string,
    description: string,
    fullDescription: string,
    images: string[],
    video: string,
    category: string[],
    provider: string,
    price: number,
    active: boolean,
    published: boolean,
    reviews?: IReview[],
    variations: IVariation[],
    additionalInfo: IAdditionalInfo[],
}
export interface IAdditionalInfo {
    id: number,
    name: string,
    description: string
}
export interface IVariation {
    name: string,
    title: string,
    stock: number,
    price: number,
    images: string[],
    video: string
}
export interface IReview {
    clientId?: string,
    text: string,
    avatar: string,
    evaluation: number,
    video?: string,
    photo?: string,
    likes?: string[]
}
export interface ICategory {
    title: string,
    id: string,
    categories?: ICategory[]
}
export interface ISelect {
    id: string,
    label: string
}

export interface IAddress {
    id?: string;
    address: string;
    houseNumber?: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    intercom?: string;
    comment?: string;
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
