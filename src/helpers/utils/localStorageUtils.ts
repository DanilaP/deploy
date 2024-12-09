export const loadSelectedIds = (): number[] | null => {
    try {
        const storedIds = localStorage.getItem("selectedProductsIds");
        return storedIds ? JSON.parse(storedIds) : null;
    } catch (error) {
        console.error("Error loading selected IDs from localStorage", error);
        return null;
    }
};

export const saveSelectedIds = (ids: number[]): void => {
    try {
        localStorage.setItem("selectedProductsIds", JSON.stringify(ids));
    } catch (error) {
        console.error("Error saving selected IDs to localStorage", error);
    }
};
