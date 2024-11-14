import UserStore from "./userStore.ts";
import CartStore from "./CartStore.ts";

class RootStore {
    userStore;
    cartStore;
    constructor() {
        this.userStore = new UserStore();
        this.cartStore = new CartStore();
    }
};

export default RootStore;
