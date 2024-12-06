import { makeAutoObservable } from "mobx";
import { loadSelectedIds, saveSelectedIds } from "../helpers/utils/localStorageUtils.ts";
import calculateTotals from "../helpers/utils/calculateTotals.ts";
import { ICartProduct } from "../interfaces/interfaces.ts";

class CartStore {
    cart: ICartProduct[] = [];
    selectedProductIds: number[] = [];
    isAllSelected: boolean = true;

    get totalSum() {
        const { totalSum } = calculateTotals(this.cart, this.selectedProductIds);
        return totalSum;
    }

    get selectedTotalQuantity() {
        const { totalQuantity } = calculateTotals(this.cart, this.selectedProductIds);
        return totalQuantity;
    }

    get totalBasketQuantity() {
        return this.cart.length;
    }

    constructor() {
        makeAutoObservable(this);
        if (typeof window !== "undefined") {
            this.selectedProductIds = loadSelectedIds() || [];
        }
    }

    setCart(cart: ICartProduct[]) {
        this.cart = cart;
        this.updateSelectionStatus();
    }

    private updateSelectionStatus() {
        const cartProductIds = this.cart.map(({ id}) => id);
        this.selectedProductIds = this.selectedProductIds.filter((id) => cartProductIds.includes(id));
        this.isAllSelected = this.cart.length > 0 && this.selectedProductIds.length === this.cart.length;
    }

    setIsAllSelected(isAllSelected: boolean) {
        this.isAllSelected = isAllSelected;
        saveSelectedIds(this.selectedProductIds);
    }

    setSelectedIds(setSelectedIds: number[]) {
        this.selectedProductIds = setSelectedIds;
        saveSelectedIds(this.selectedProductIds);
    }

    setCartProductQuantity(productId: number, newQuantity: number) {
        this.cart = this.cart.map((product) =>
            product.id === productId ? { ...product, number: newQuantity } : product
        );
    }
}

export default CartStore;

