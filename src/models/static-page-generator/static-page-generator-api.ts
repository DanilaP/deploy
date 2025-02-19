import $api from '../../configs/axiosconfig/axios.js';
import { INewStaticPageInfo, IStaticPageInfo } from './static-page-generator.js';

export const getStaticPageInfo = (id: number) => {
    const response = $api.get(`/static-page?id=${ id }`);
    return response;
};

export const getStaticPagesInfo = () => {
    const response = $api.get(`/static-pages`);
    return response;
};

export const saveStaticPageInfo = (newStaticPageData: IStaticPageInfo) => {
    const response = $api.put(`/static-page?id=${ newStaticPageData.id }`, newStaticPageData);
    return response;
};

export const createStaticPage = (newStaticPageData: INewStaticPageInfo) => {
    const response = $api.post(`/static-page`, newStaticPageData);
    return response;
};