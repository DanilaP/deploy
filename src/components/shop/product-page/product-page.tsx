import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/interfaces";
import $api from "../../../configs/axiosconfig/axios";
import { useNavigate, useParams } from "react-router";
import "./product-page.scss";
import { useTranslation } from "react-i18next";
import ProductInfo from "./product-page-info/product-page-info";
import ProductSlider from "./product-page-slider/product-page-slider";

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

    return (
        <div className='product-page'>
            <div className="product-page-main">
                <div className="product-page-main-header">
                    { product?.name + ". " } 
                    { t("text.choosenVariation") }: { `"${ variationInfo?.title }"` }
                </div>
                <div className="product">
                    <div className="product-main">
                        <ProductSlider variationInfo = { variationInfo } />
                        { 
                            product 
                            ? <ProductInfo 
                                product={ product } 
                                variationInfo={ variationInfo }
                                changeVariation={ changeVariation }
                            /> 
                            : null 
                        } 
                    </div>
                    <div className="image-list">
                        {
                            product?.images.map((image) => {
                                return (
                                    <img className="image-list-img" src = { image } key={ image } />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}