export interface IUser {
    id?: string,
    login?: string,
    password?: string,
    role?: string,
    avatar?: string,
    backet?: any[]
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
    dateOfCreation: string,
    contactPerson: IContactPerson,
    description: string,
    website: string,
    [key: string]: any,
}