import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../../translation/i18n';
import '../../../stylesheets/servicepages.scss';

export default function Page404 () {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.error404");
    });
    return (
        <div className='service__main'> 
            { t("titles.error404") }
        </div>
    );
}