import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from "/src/translation/i18n";

export default function HomePage () {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.homePage");
    });
    return (
        <div>
            { t("titles.homePage") }
        </div>
    );
}