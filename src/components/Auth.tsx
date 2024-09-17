import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from "/src/translation/i18n";

export default function AuthPage () {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.authPage");
    });
    return (
        <div>
            { t("titles.authPage") }
        </div>
    );
}