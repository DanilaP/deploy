import { IAdditionalInfo, IProduct, IVariation } from "../../../../../interfaces/interfaces";

export const TEXT_FIELD_FOR_VALIDATION_IN_VARIATIONS = ['name', 'title'];
export const NUM_FIELD_FOR_VALIDATION_IN_VARIATIONS = ['price'];

export const validateVariations = (variations: IVariation[]) => {
    let validationData: any = { isValid: true };
    variations.forEach((info, index) => {
        TEXT_FIELD_FOR_VALIDATION_IN_VARIATIONS.map(key => {
            if (info[key]?.length === 0) {
                validationData = { 
                    ...validationData, 
                    isValid: false, 
                    [index]: {
                        ...validationData[index],
                        [key]: { error: "errors.requiredField" }
                    } 
                };
            }
        });
        NUM_FIELD_FOR_VALIDATION_IN_VARIATIONS.map(key => {
            if (info[key] === 0) {
                validationData = { 
                    ...validationData, 
                    isValid: false, 
                    [index]: {
                        ...validationData[index],
                        [key]: { error: "errors.notZero" }
                    } 
                };
            }
        });
    });
    
    return validationData;
};

export const validateAdditionalInfo = (additionalInfo: IAdditionalInfo[]) => {
    let validationData: any = { isValid: true };
    additionalInfo.forEach((info, index) => {
        if (info.name.length === 0) {
            validationData = { 
                ...validationData, 
                isValid: false, 
                [index]: {
                    ...validationData[index],
                    name: { error: "errors.requiredField" }
                } 
            };
        }
        if (info.description.length === 0) {
            validationData = { 
                ...validationData, 
                isValid: false, 
                [index]: {
                    ...validationData[index],
                    description: { error: "errors.requiredField" }
                } 
            };
        }
    });
    return validationData;
};

export const validateGoodsForm = (goodData: IProduct) => {
    let validationData: any = { formValid: true };
    
    COMMON_FIELDS_FOR_VALIDATION.forEach((key: string) => {
        if (goodData[key].length === 0) {
            validationData = { ...validationData, [key]: { error: "errors.requiredField" }, formValid: false };
        }
    });
    const validationAdditionalInfo = validateAdditionalInfo(goodData.additionalInfo);
    const validationVariations = validateVariations(goodData.variations);
    
    if (!validationAdditionalInfo.isValid) {
        validationData = { ...validationData, additionalInfo: validationAdditionalInfo, formValid: false };
    }
    
    if (!validationVariations.isValid) {
        validationData = { ...validationData, variations: validationVariations, formValid: false };
    }

    return validationData;
};

export const COMMON_FIELDS_FOR_VALIDATION: string[]
    = ["articleNumber", "name", "provider", "category", "description", "fullDescription", "images", "video"];