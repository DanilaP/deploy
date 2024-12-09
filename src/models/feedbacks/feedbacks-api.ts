import $api from '../../configs/axiosconfig/axios.js';
import { IFeedBack } from './feedbacks.js';

export const createFeedback = (newFeedback: IFeedBack) => {
    const response = $api.post("/feedbacks", newFeedback);
    return response;
};

export const getFeedbacks = (userId: number | null) => {
    const response = $api.get(`/feedbacks?userId=${userId}`);
    return response;
};

export const deleteFeedback = (feedbackId: number) => {
    const response = $api.delete(`/feedbacks?feedbackId=${feedbackId}`);
    return response;
};

export const updateFeedback = (newFeedback: IFeedBack) => {
    const response = $api.put("/feedbacks", newFeedback);
    return response;
};