import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from "/src/translation/i18n";

export default function AboutPage (props:any) {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.aboutPage");
    });
    return (
        <div>
            { t("titles.aboutPage") }
        </div>
    );
}