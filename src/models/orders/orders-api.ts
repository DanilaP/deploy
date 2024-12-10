import $api from "../../configs/axiosconfig/axios.js";

const url = '/orders';
export const getOrders = async () => {
    const { data } = await $api.get(url);
    return data;
};
