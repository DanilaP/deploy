export interface IUser {
    id?: string,
    login?: string,
    password?: string,
    role?: string,
    avatar?: string
}
export interface IPermition {
    name: string,
    description: string
}
export interface IRole {
    name: string,
    permitions: IPermition[]
}