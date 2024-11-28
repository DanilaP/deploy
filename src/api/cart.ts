import $api from "../configs/axiosconfig/axios.js";

const endpoints = {
    getUserCart: '/backet',
    getWarehouses: '/warehouses',
    getUserDeliveryData: (userId: number) =>  `/user/data-delivery/${ userId }`
}

const cartApi = () => {
    return {
        async getUserCart () {
            const { data: { backet } } = await $api.get('/backet');
            return backet;
        },
        async removeProductByIds(ids: string) {
            const { data: { backet } } = await $api.delete("/backet", {
                params: {
                    ids,
                }
            });
            return backet;
        },
        async getWareHouses ()  {
            const { data } = await $api.get(endpoints.getWarehouses);
            return data.stores;
        },
        async getUserDeliveryData (userId: number) {
            const { data } = await $api.get(endpoints.getUserDeliveryData(userId));
            return data;
        },
    };
};

export default cartApi;
