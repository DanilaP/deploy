import UserStore from "./userStore.ts";

class RootStore {
    userStore;
    constructor() {
        this.userStore = new UserStore();
    }
};

export default RootStore;
