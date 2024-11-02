import { makeAutoObservable } from "mobx";
import { IProduct } from "../interfaces/interfaces.ts";

class CartStore {
    cart: IProduct[] = []
    selectedProductIds: number[] = []
    totalSum: number = 0
    isAllSelected: boolean = true
    selectedTotalQuantity: number = 0
    totalBasketQuantity: number = 0
    constructor() {
        makeAutoObservable(this);
    }
    setCart(cart: IProduct[]) {
        this.cart = cart;
        this.calculateTotals();
    }
    setSelectedProductIds(ids: number[]) {
        this.selectedProductIds = ids;
        this.calculateTotals();
    }
    setIsAllSelected(flag: boolean) {
        this.isAllSelected = flag;
        this.calculateTotals();
    }
    setTotalBasketQuantity(totalBasketQuantity: number) {
        this.totalBasketQuantity = totalBasketQuantity;
    }

    toggleProductSelection(productId: number) {
        if (this.selectedProductIds.includes(productId)) {
            if (this.selectedProductIds.length === 1) {
                this.isAllSelected = false;
            }
            this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
        } else {
            this.selectedProductIds = [...this.selectedProductIds, productId];
            if (this.selectedProductIds.length === this.totalBasketQuantity) {
                this.isAllSelected = true;
            }
        }
        this.calculateTotals();
    }

    updateCartData(totalSum: number, selectedTotalQuantity: number) {
        this.selectedTotalQuantity = selectedTotalQuantity;
        this.totalSum = totalSum;
    }

    updateProductQuantity(productId: number, newQuantity: number) {
        this.cart = this.cart.map(product =>
            product.id === productId
                ? { ...product, number: newQuantity }
                : product
        );
        this.calculateTotals();
    }

    calculateTotals() {
        const filteredBasket = this.cart.filter(product => this.selectedProductIds.includes(product.id));
        const totalQuantity = filteredBasket.reduce((acc, product) => acc + product.number, 0);
        const totalSum = filteredBasket.reduce((acc, product) => {
            const variation = product.productInfo.variations.find(v => v.name === product.variation);
            return acc + (variation?.price || 0) * product.number;
        }, 0);
        this.updateCartData(totalSum, totalQuantity);
    }
};

export default CartStore;
