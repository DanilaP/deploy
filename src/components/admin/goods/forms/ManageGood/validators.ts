import { IAdditionalInfo, IProduct, IVariation } from "../../../../../interfaces/interfaces";

export const validateVariations = (variations: IVariation[]) => {
    let isValid: boolean = true;
    variations.forEach(variation => {
        if (
            variation.name.length === 0 ||
            variation.title.length === 0 || 
            variation.price === 0 || 
            variation.stock === 0
        ) {
            isValid = false;
            return isValid;
        }
    });
    return isValid;
};

export const validateAdditionalInfo = (additionalInfo: IAdditionalInfo[]) => {
    let isValid: boolean = true;
    additionalInfo.forEach(info => {
        if (
            info.name.length === 0 ||
            info.description.length === 0
        ) {
            isValid = false;
            return isValid;
        }
    });
    return isValid;
};

export const validateCommonFields = (newGoodData: IProduct) => {
    let isValid = true;
    if ( newGoodData?.category.length === 0 ||
        newGoodData?.name.length === 0 ||
        newGoodData?.provider.length === 0 ||
        newGoodData?.description.length === 0 ||
        newGoodData?.fullDescription.length === 0 ||
        !newGoodData?.images ||
        !newGoodData?.video ||
        newGoodData?.provider.length === 0 
    ) {
        isValid = false;
        return isValid;
    }
    return isValid;
};