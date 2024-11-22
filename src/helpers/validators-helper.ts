const validateRequiredField = (value: any) => {
    if (!value) return false;
    if (value.length === 0) return false;
    return true;
};

export { validateRequiredField };