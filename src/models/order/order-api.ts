import $api from "../../configs/axiosconfig/axios.js";

const url = '/order';

export const getOrder = async (queryId: string) => {
    const { data: { order } } = await $api.get(url, { params: { id: queryId } });
    return order;
};
