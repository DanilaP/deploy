import $api from '../../configs/axiosconfig/axios.js';

export const createCategory = (categoryTitle: string) => {
    const response = $api.post("/category", { title: categoryTitle });
    return response;
};

export const getCategories = () => {
    const response = $api.get("/category");
    return response;
};

export const deleteCategory = (categoryId: string) => {
    const response = $api.delete(`/category?categoryId=${categoryId}`);
    return response;
};

export const updateCategory = (updatedCategoryData: string) => {
    const response = $api.put("/category", updatedCategoryData);
    return response;
};