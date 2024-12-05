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