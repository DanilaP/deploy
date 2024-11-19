import { t } from "i18next";

const validateRequiredField = (value: any) => {
    if (!value) return false;
    if (value.length === 0) return false;
    return true;
};
const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
export const validateRequiredEmail = (email: string) => {
    if (validateEmail(email)) {
        return true;
    } else {
        if (validateRequiredField(email)) {
            return t("text.invalidEmail");
        }
        return t("text.requiredField");
    }
};
export { validateRequiredField, validateEmail };