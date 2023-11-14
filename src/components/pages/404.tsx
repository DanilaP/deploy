import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from "/src/translation/i18n";

export default function Page404 () {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.error404");
    });
    return (
        <div>
            { t("titles.error404") }
        </div>
    );
}