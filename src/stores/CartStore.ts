import { makeAutoObservable } from "mobx";

class CartStore {
    cart: any[] = []
    selectedProductIds: any[] = []
    totalSum: number = 0
    isAllSelected: boolean = true
    selectedTotalQuantity: number = 0
    totalBasketQuantity: number = 0
    constructor() {
        makeAutoObservable(this);
    }
    setCart(cart: any) {
        this.cart = cart;
    }
    setSelectedProductIds(ids: any) {
        this.selectedProductIds = ids;
    }
    setIsAllSelected(flag: boolean) {
        this.isAllSelected = flag;
    }
    setTotalBasketQuantity(totalBasketQuantity: number) {
        this.totalBasketQuantity = totalBasketQuantity;
    }

    toggleProductSelection(productId: string) {
        if (this.selectedProductIds.includes(productId)) {
            this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
        } else {
            this.selectedProductIds = [...this.selectedProductIds, productId];
        }
    }

    updateCartData(totalSum: number, selectedTotalQuantity: number) {
        this.selectedTotalQuantity = selectedTotalQuantity;
        this.totalSum = totalSum;
    }
};

export default CartStore;
