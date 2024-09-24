import { IUser } from "../interfaces/interfaces";

export const validator = {
    
    validateEmail: function(email: string) {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
    
    validateForm: function(userData: IUser | undefined) {
        if (userData?.login && userData.password) {
            if (this.validateEmail(userData.login)) {
                return true;
            }
        }
    }
};