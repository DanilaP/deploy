import { useEffect, useState } from "react";
import $api from "../../../../configs/axiosconfig/axios";
import { useNavigate, useParams } from "react-router";
import "./product-page.scss";
import { useTranslation } from "react-i18next";
import ProductInfo from "./product-page-info/product-page-info";
import ProductSlider from "./product-page-slider/product-page-slider";
import { Skeleton } from "@mui/material";
import { IProduct } from "../../../../models/products/products";

export default function ProductPage () {
    
    const { t } = useTranslation();
    const [product, setProduct] = useState<IProduct>();
    const [variationInfo, setVariationInfo] = useState<any>();
    const navigate = useNavigate();
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
            if (res.data.product) {
                setProduct(res.data.product);
            }
            else navigate("/shop");
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        document.title = t("titles.productPage");
    }, []);

    return (
        product ? (
            <div className='product-page'>
                <div className="product-page-main">
                    <div className="product-page-main-header">
                        { product?.name } { " " }
                        { t("text.choosenVariation") }: { `"${ variationInfo?.title }"` }
                    </div>
                    <div className="product">
                        <div className="product-main">
                            <ProductSlider variationInfo = { variationInfo } />
                            <ProductInfo 
                                product={ product } 
                                variationInfo={ variationInfo }
                                changeVariation={ changeVariation }
                            /> 
                        </div>
                        <div className="additional-description">
                            <div className="full-description">
                                <div>
                                    <strong>{ t("text.description") }</strong>
                                </div>
                                <div>{ product.fullDescription }</div>
                            </div>
                            <div className="additional-info">
                                {
                                    product.additionalInfo.map((info: any, index: number) => {
                                        return (
                                            <div key={ index } className="info">
                                                <div className="name">{ info.name }</div>
                                                <div className="description">{ info.description }</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
        : <Skeleton style={ { margin: "0 auto" } } variant="rectangular" width={ "60vw" } height={ "90vh" }/>
    );
}

