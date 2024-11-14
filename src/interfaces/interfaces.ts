export interface IUser {
    id?: string,
    country: string,
    city: string,
    name: string,
    tel: string,
    login?: string,
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
    id: number,
    name: string,
    description: string,
    fullDescription: string,
    images: string[],
    video: string,
    category: string[],
    provider: string,
    reviews: IReview[],
    variations: IVariation[],
    additionalInfo: IAdditionalInfo[]
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

export interface IAddressForm {
    id?: string;
    address: string;
    apartment: string;
    entrance: string;
    floor: string;
    intercom: string;
    comment?: string;
}

export interface IStore {
    id: string;
    storeName: string;
    location: string;
    storageDuration: string;
}

export interface IDeliveryData {
    prevPaymentMethod: string;
    prevDeliveryMethod: string;
    prevDelivery: {
        storeId: string;
        prevAddressId: string;
        addresses: IAddressForm[];
    };
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
