import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';

export default function ProductSlider (props: { variationInfo: any }) {

    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.aboutPage");
    });
    
    return (
        <div className="product-slider">
            <Swiper navigation={true} modules={[Navigation]}>
                {
                    props.variationInfo?.images.map((image: string) => {
                        return (
                            <SwiperSlide style={{ width: "100%" }} key={ image }>
                                <img className = "swiper-image" src = { image }></img>
                            </SwiperSlide>
                        );
                    })
                }
                <SwiperSlide key = { props.variationInfo?.video }>
                    <video className = "swiper-video" controls src = { props.variationInfo?.video }/>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}