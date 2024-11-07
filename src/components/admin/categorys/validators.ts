export const validateNewCategory = (newCategoryTitle: string) => {
    let formValidData = { 
        title: {
            valid: true,
            error: ""
        }, 
        formValid: true 
    };
    if (newCategoryTitle.length === 0) {
        formValidData = { 
            ...formValidData, 
            title: {
                valid: false,
                error: "errors.requiredField"
            },
            formValid: false
        };
    }
    return formValidData;
};