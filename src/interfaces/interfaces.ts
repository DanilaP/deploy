export interface IUser {
    id?: string,
    isActive?: boolean,
    isVerified?: boolean,
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

export interface IStore {
    id: number,
    name: string,
    address: string,
    products: {
        productId: number,
        variation: string,
        amount: number,
        productInfo: IProduct
    }[]
}
export interface ICategory {
    title: string,
    id: string,
    categories?: ICategory[],
    image: string,
    description: string,
}
export interface ISelect {
    id: string,
    label: string
}
export interface IContactPerson {
    id?: number,
    name: string,
    phoneNumber: string,
    post: string,
    [key: string]: any,
}
export interface IProvider {
    id?: number,
    name: string,
    active: boolean,
    createdAt: string,
    contactPerson: IContactPerson,
    description: string,
    website: string,
    email: string,
    deletedAt: string | null,
    ogrn: string,
    inn: string,
    [key: string]: any,
}
