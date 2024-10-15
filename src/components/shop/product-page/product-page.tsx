import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/interfaces";
import $api from "../../../configs/axiosconfig/axios";
import { useParams } from "react-router";
import "./product-page.scss";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import { Button } from "@mui/material";

export default function ProductPage () {
    
    const { t } = useTranslation();
    const [product, setProduct] = useState<IProduct>();
    const [variationInfo, setVariationInfo] = useState<any>();
    const query = useParams();

    const changeVariation = (variationName: string) => {
        const info = product?.variations.filter((variation: any) => variation.name === variationName)[0];
        setVariationInfo(info);
    };

    useEffect(() => {
        setVariationInfo(product?.variations[0]);
    }, [product]);

    useEffect(() => {
        $api.get(`/product/?id=${ query.id }`)
        .then((res) => {
            setProduct(res.data.product);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className='product-page'>
            <div className="product">
                <div className="product-slider">
                    <Swiper pagination={true} modules={[Pagination]}>
                        {
                            product?.images.map((image) => {
                                return (
                                    <SwiperSlide key={ image }>
                                        <img src = { image }></img>
                                    </SwiperSlide>
                                );
                            })
                        }
                    </Swiper>
                </div>
                <div className="product-info">
                    <div className="item">
                        <h1>{ product?.name }</h1>
                        Выбранная вариация: {`"${ variationInfo?.title }"`}
                    </div>
                    <div className="item">
                        <b>{ t("text.description") }</b>: { product?.description }
                    </div>
                    <div className="item">
                        <b>{ t("text.cost") }</b>: { variationInfo?.price } { t("text.rub") }
                    </div>
                    <div className="item">
                        <b>{ t("text.stock") }</b>: { variationInfo?.stock } { t("text.pcs") }
                    </div>
                    <div className="variations">
                        Вариации: 
                        {
                            product?.variations.map((variation: any) => {
                                return (
                                    <div key={ variation.name } className="variation">
                                        <div onClick={ () => changeVariation(variation.name) } className="variation-name">{ variation.title }</div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <Button variant = "contained">{ t("text.toBacket") }</Button>
                </div>
            </div>
        </div>
    );
}