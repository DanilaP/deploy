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
const validateWebsiteRef = (email: string) => {
    return email.match(
        /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
    );
};
const validatePhone = (phone: string) => {
    const cleanedTel = phone.replace(/\D/g, '');
    const russianTelLength = 11;
    return cleanedTel.length === russianTelLength;
};

export { validateRequiredField, validateEmail, validatePhone, validateWebsiteRef };