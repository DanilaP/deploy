export interface IUser {
    id?: string,
    isActive?: boolean,
    isVerified?: boolean,
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
    categories?: ICategory[]
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