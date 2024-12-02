import { t } from "i18next";

const validateRequiredField = (value: any) => {
    if (!value) return false;
    if (value.length === 0) return false;
    return true;
};
const validateEmail = (email: string) => {
    return email.match(
        /^(?!\.)(?!.*\.\.)[a-zA-Z0-9а-яА-ЯёЁ._%+-]{1,255}@[a-zA-Z0-9а-яА-ЯёЁ.-]{1,255}\.[a-zA-Zа-яА-ЯёЁ]{2,255}$/
    );
};
const validateRequiredEmail = (email: string) => {
    return email.match(
        /^(?!\.)(?!.*\.\.)[a-zA-Z0-9а-яА-ЯёЁ._%+-]{1,255}@[a-zA-Z0-9а-яА-ЯёЁ.-]{1,255}\.[a-zA-Zа-яА-ЯёЁ]{2,255}$/
    );
};
const validateWebsiteRef = (email: string) => {
    return email.match(
        /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
    );
};
const validateOgrn = (value: string) => {
    return value.match(
        /^[0-9]{13,13}$/
    );
};
const validateInn = (value: string) => {
    const isValid = value.match(/^[0-9]{12,12}$/) || value.match(/^[0-9]{10,10}$/);
    return isValid;
};
const validatePhone = (phone: string) => {
    const cleanedTel = phone.replace(/\D/g, '');
    const russianTelLength = 11;
    return cleanedTel.length === russianTelLength;
};

export { 
    validateRequiredField, 
    validateEmail, 
    validatePhone, 
    validateWebsiteRef,
    validateOgrn,
    validateInn,
    validateRequiredEmail
};
