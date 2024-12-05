export interface IWarehouse {
    id: number,
    name: string,
    address: string,
    products: {
        productId: number,
        variation: string,
        number: number,
        productInfo: any
    }[]
}