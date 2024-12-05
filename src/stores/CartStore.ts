import { makeAutoObservable } from "mobx";
import { IProduct } from "../models/products/products";

class CartStore {
    cart: IProduct[] = [];
    selectedProductIds: number[] = [];
    totalSum: number = 0;
    isAllSelected: boolean = true;
    selectedTotalQuantity: number = 0;
    totalBasketQuantity: number = 0;
    constructor() {
        if (typeof window !== 'undefined') {
            const storedIds = localStorage.getItem('selectedProductsIds');
            this.selectedProductIds = storedIds ? JSON.parse(storedIds) : [];
        } else {
            this.selectedProductIds = [];
        }
        makeAutoObservable(this);
    }
    setCart(cart: IProduct[]) {
        this.cart = cart;
        this.setTotalBasketQuantity(this.cart.length);
        const validIds = cart.map(product => product.id);
        this.selectedProductIds = this.selectedProductIds.filter(id => validIds.includes(id));
        this.isAllSelected = this.cart.length ===  this.selectedProductIds.length;
        this.calculateTotals();
    }

    setSelectedProductIds(ids: number[]) {
        this.selectedProductIds = ids;
        this.isAllSelected = ids.length === this.cart.length;
        localStorage.setItem('selectedProductsIds', JSON.stringify(this.selectedProductIds));
        this.calculateTotals();
    }

    setTotalBasketQuantity(totalBasketQuantity: number) {
        this.totalBasketQuantity = totalBasketQuantity;
    }

    toggleProductSelection(productId: number) {
        const isSelected = this.selectedProductIds.includes(productId);

        this.selectedProductIds = isSelected
            ? this.selectedProductIds.filter(id => id !== productId)
            : [...this.selectedProductIds, productId];

        this.isAllSelected = this.selectedProductIds.length === this.cart.length;
        localStorage.setItem('selectedProductsIds', JSON.stringify(this.selectedProductIds));
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
            return acc + (variation?.price || 1) * product.number;
        }, 0);
        this.updateCartData(totalSum, totalQuantity);
    }
}

export default CartStore;
