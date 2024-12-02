import { makeAutoObservable } from "mobx";
import { IUser, IPermission } from "../interfaces/interfaces.ts";

class UserStore {
    user: IUser | null = null
    permissions: string[] = []
    allPermissions: IPermission[] = []
    draggablePermission = null
    constructor() {
        makeAutoObservable(this);
    }
    setUser(user: IUser | null) {
        this.user = user;
    }

    updateUserData(partialData: Partial<IUser>) {
       this.user = { ...this.user, ...partialData };
    }
    setPermissions(permissions: string[]) {
        this.permissions = permissions;
    }
    setAllPermissions(allPermisions: IPermission[]) {
        this.allPermissions = allPermisions;
    }
    setDraggablePermission(draggablePermission: any) {
        this.draggablePermission = draggablePermission;
    }
}

export default UserStore;
