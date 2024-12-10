import { IAddress } from "../../interfaces/interfaces.ts";

export interface IPrevDelivery {
    id: number,
    wareHouseId: number | null,
    address: IAddress | null,
    timeStamp: string,
    type: string,
    payment: {
        method: string,
        timeStamp: string,
    },
    comment: string,
}

export interface IDeliveryData {
    userId: number,
    prevDeliveries: IPrevDelivery[],
}
