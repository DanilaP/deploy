import $api from "../../../../configs/axiosconfig/axios.js";

export const getOrdersStatistics = (dateFrom: string | null, dateTo: string | null, selectedUserId: number | null) => {
    const response = $api.get(`statistic/orders?dateFrom=${dateFrom}&dateTo=${dateTo}&userId=${selectedUserId}`);
    return response;
};

export const getPlacesStatistics = () => {
    const response = $api.get('statistic/places');
    return response;
};