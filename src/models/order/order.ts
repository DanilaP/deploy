import { IAddress } from "../../interfaces/interfaces.ts";

export interface IOrderProduct {
    id: number;
    number: number;
    variation: string;
}

 interface IOrder {
    orderId: number;
    userId: number;
    orderNumber: number;
    orderStatus: "waiting" | "delivered" | "in-transit" | "cancelled" | string;
    createdAt: string;
    deliveredAt: string;
    estimatedDeliveryDate: string;
    paymentMethod: "card" | "cash" | "spb" | string;
    deliveryMethod: "courier" | "pickup" | "other" | string;
    address: IAddress;
    orderPrice: number;
    products: IOrderProduct[];
}

export default IOrder;
