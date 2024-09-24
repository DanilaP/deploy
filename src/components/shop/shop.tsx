import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import MediaCard from './card/card';


export default function ShopPage () {

    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("titles.shopPage");
    });

    return (
        <div className='shop__wrapper'>
            <div className="shop__header">
                <h1>{ t("text.products") }</h1>
                <div className="shop__header_filters">
                    
                </div>
            </div>
            <div className="shop__content">
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
            </div>
            <div className="shop__footer"></div>
        </div>
    );
}