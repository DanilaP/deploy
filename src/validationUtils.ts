import { TFunction } from "i18next";

interface ValidationErrors {
    name?: string;
    tel?: string;
    payment?: string;
    delivery?: string;
}

interface ValidationResult {
    isValid: boolean;
    errors: ValidationErrors;
}

export const validateTel = (tel: string, t: TFunction): ValidationResult => {
    let isValid = true;
    const errors: ValidationErrors = { tel: '' };
    const cleanedTel = tel.replace(/\D/g, '');
    const russianTelLength = 11;

    if (!tel) {
        errors.tel = t('text.checkout.errors.emptyTel');
        isValid = false;
    } else if (cleanedTel.length < russianTelLength) {
        errors.tel = t('text.checkout.errors.incorrectTel');
        isValid = false;
    }

    return { isValid, errors };
};

export const validateDelivery = (delivery: string, t: TFunction): ValidationResult => {
    let isValid = true;
    const errors: ValidationErrors = { delivery: '' };

    if (!delivery) {
        errors.delivery = t('text.checkout.errors.emptyDelivery');
        isValid = false;
    }

    return { isValid, errors };
};

export const validatePayment = (payment: string, t: TFunction): ValidationResult => {
    let isValid = true;
    const errors: ValidationErrors = { payment: '' };

    if (!payment) {
        errors.payment = t('text.checkout.errors.emptyPayment');
        isValid = false;
    }

    return { isValid, errors };
};


export const validateCheckout = (
    delivery: string,
    payment: string,
    t: TFunction
): ValidationResult => {
    const deliveryValidation = validateDelivery(delivery, t);
    const paymentValidation = validatePayment(payment, t);

    const isValid =  deliveryValidation.isValid && paymentValidation.isValid;

    const errors = {
        ...deliveryValidation.errors,
        ...paymentValidation.errors,
    };

    return { isValid, errors };
};

