export interface IUser {
    id?: string,
    login?: string,
    password?: string,
    role?: string,
    avatar?: string,
    backet: IProduct[]
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
    category: string,
    provider: string,
    reviews: IReview[],
    variations: object[],
    additionalInfo: []
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