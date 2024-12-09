export interface IInvoice {
    type: "expense" | "receipt",
    id: number,
    dateFrom: string,
    provider: number,
    warehouse: number,
    status: string,
    products: [{
        id: number,
        name: string,
        price: number,
        amount: number,
        sum: number
    }]
}