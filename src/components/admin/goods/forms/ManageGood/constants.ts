import { IProduct, IReview } from "../../../../../interfaces/interfaces";

export const DEFAULT_PRODUCT: IProduct = {
    name: "",
    partNumber: "",
    description: "",
    fullDescription: "",
    images: [] as string[],
    video: "",
    category: [] as string[],
    provider: "",
    reviews: [] as IReview[],
    variations: [
        { name: "", title: "", stock: 0, price: 0, images: [""], video: "" }
    ],
    additionalInfo: [{ name: "", description: "", id: Date.now() }],
};

export const DEFAULT_CATEGORIES = [
    { label: "Вычислительная техника", id: 1 },
];