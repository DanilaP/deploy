import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import MediaCard from './card/card';


export default function ShopPage () {

    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("titles.shopPage");
    });

    return (
        <div className='shop-wrapper'>
            <div className="shop-header">
                <h1>{ t("text.products") }</h1>
                <div className="shop-header-filters">
                    
                </div>
            </div>
            <div className="shop-content">
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
            </div>
            <div className="shop-footer"></div>
        </div>
    );
}