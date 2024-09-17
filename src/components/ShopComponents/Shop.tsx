import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';

export default function ShopPage () {

    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("titles.shopPage");
    });

    return (
        <div className='shop__wrapper'>
            <div className="header">Shop header</div>
            <div className="content">Shop content</div>
            <div className="footer">Shop footer</div>
        </div>
    );
}