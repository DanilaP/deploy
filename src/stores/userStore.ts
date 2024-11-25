import { makeAutoObservable } from "mobx";
import { IUser, IPermission } from "../interfaces/interfaces.ts";

class UserStore {
    user: IUser | null = null
    permissions: string[] = []
    allPermissions: IPermission[] = []
    draggablePermission = null
    socketConnection: WebSocket | null = null
    constructor() {
        makeAutoObservable(this);
    }
    setUser(user: IUser | null) {
        this.user = user;
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
    setSocketConnection(socket: WebSocket | null) {
        this.socketConnection = socket;
    }
}

export default UserStore;
