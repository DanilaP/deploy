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
export interface IContactPerson {
    id?: number,
    name: string,
    phoneNumber: string,
    post: string,
    [key: string]: any,
}