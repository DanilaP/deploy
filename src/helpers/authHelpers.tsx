import { IUser } from "../interfaces/interfaces";

export const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateForm = (userData: IUser | undefined) => {
    if (userData?.login && userData.password) {
        if (validateEmail(userData.login)) {
            return true;
        }
    }
}