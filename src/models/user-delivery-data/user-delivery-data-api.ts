import $api from "../../configs/axiosconfig/axios.js";

const url = '/user/data-delivery/';

export const getUserDeliveryData = async (userId: number) => {
    const { data } = await $api.get(`${ url }${ userId }`);
    return data;
};

