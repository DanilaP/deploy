export interface IDiscount  {
    id?: number,
    name: string,
    systemKey: string,
    value: number,
    dateStart: string,
    dateEnd: string | null,
    categories: string[],
    active: boolean,
    deletedAt: string | null,
    type: string
}