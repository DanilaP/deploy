export interface IUser {
    id?: string,
    isActive?: boolean,
    isVerified?: boolean,
    country?: string,
    city?: string,
    login?: string,
    name?: string,
    tel?: string,
    password?: string,
    role?: string,
    avatar?: string,
    backet?: any[],
    favorites?: number[]
}