import { IReview } from "../models/products/products";

export const getAverageEvaluation = (reviews: IReview[]) => {
    const evaluationQuantity = reviews.length;
    let averageValue: number = 0;
    reviews.map((review: any) => {
        averageValue += review.evaluation;
    });
    return (averageValue / evaluationQuantity).toFixed(1);
};