import { ICartProduct } from "../../interfaces/interfaces.ts";

const calculateTotals = (cart: ICartProduct[], selectedIds: number[]) => {
    const selectedProducts = cart.filter((product) => selectedIds.includes(product?.id));
    const totalSum = selectedProducts.reduce((sum, product) => {
        const variation = product?.productInfo?.variations.find((v) => v.name === product?.variation);
        return sum + (variation?.price || 0) * product?.number;
    }, 0);

    const totalQuantity = selectedProducts.reduce((sum, product) => sum + product?.number, 0);

    return { totalSum, totalQuantity };
};

export default calculateTotals;
