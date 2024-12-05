import { makeAutoObservable } from "mobx";
import { IPermission, IChat } from "../interfaces/interfaces.ts";
import { IUser } from "../models/user/user.ts";

class UserStore {
    user: IUser | null = null
    permissions: string[] = []
    allPermissions: IPermission[] = []
    draggablePermission = null
    socketConnection: WebSocket | null = null
    chatInfo: IChat | null = null
    notification: { text: string, senderId: number } | null = null
    isChatOpen: boolean = false
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
    setSocketConnection(socket: WebSocket | null) {
        this.socketConnection = socket;
    }
    setChatInfo(chat: IChat| null) {
        this.chatInfo = chat;
    }
    setNotification(notification: { text: string, senderId: number } | null) {
        this.notification = notification;
    }
    setIsChatOpen(chatOpen: boolean) {
        this.isChatOpen = chatOpen;
    }
}

export default UserStore;
