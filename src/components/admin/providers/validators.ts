import { IProvider } from "../../../interfaces/interfaces";

export const validateProviderForm = (providerData: IProvider) => {
    let validationData: any = { formValid: true };

    COMMON_FIELDS_FOR_VALIDATION.forEach((key: string) => {
        if (providerData[key].length === 0) {
            validationData = { ...validationData, [key]: { error: "errors.requiredField" }, formValid: false };
        }
    });

    CONTACT_PERSON_FIELDS_FOR_VALIDATION.forEach((key: string) => {
        if (providerData.contactPerson[key].length === 0) {
            validationData = { 
                ...validationData, 
                contactPerson: {
                    ...validationData.contactPerson,
                    [key]: { error: "errors.requiredField" }
                }, 
                formValid: false 
            };
        }
    });

    return validationData;
};

export const COMMON_FIELDS_FOR_VALIDATION: string[]
    = ["name", "dateOfCreation", "description", "website"];
export const CONTACT_PERSON_FIELDS_FOR_VALIDATION: string[]
    = ["name", "phoneNumber", "post"];