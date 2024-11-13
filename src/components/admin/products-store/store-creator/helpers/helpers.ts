export const validator = {

    validateRequiredField: function(fieldValue: string) {
        if (!fieldValue) return false;
        if (fieldValue.length === 0) return false;
        return true;
    }
};