export interface ICategory {
    title: string,
    id: string,
    categories?: ICategory[],
    image: string,
    description: string,
}