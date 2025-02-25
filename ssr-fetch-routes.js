const SSR_FETCH_ROUTES = [
    {
        path: "/static/:id",
        fetchList: (params) => {
            return {
                content: `/static-page?id=${params.id}`,
            };
        },
        params: true,
    }
];

export default SSR_FETCH_ROUTES;