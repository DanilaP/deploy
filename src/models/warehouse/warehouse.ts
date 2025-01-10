export interface IWarehouse {
    id: number,
    name: string,
    address: string,
    products: {
        productId: number,
        variation: string,
        amount: number,
        productInfo: any
    }[]
}