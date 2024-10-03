export interface IUser {
    id?: string,
    login?: string,
    password?: string,
    role?: string,
    avatar?: string
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