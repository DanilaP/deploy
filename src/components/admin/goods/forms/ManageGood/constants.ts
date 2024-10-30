import { IProduct, IReview } from "../../../../../interfaces/interfaces";

export const DEFAULT_PRODUCT: IProduct = {
    name: "",
    description: "",
    fullDescription: "",
    images: [] as string[],
    video: "",
    category: "",
    provider: "",
    reviews: [] as IReview[],
    variations: [
        { name: "", title: "", stock: 1, price: 1, images: [""], video: "" }
    ],
    additionalInfo: [{ name: "", description: "" }],
};