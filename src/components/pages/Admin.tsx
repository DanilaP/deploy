import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from "/src/translation/i18n";

export default function AdminPage () {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.adminPage");
    });
    return (
        <div>
            { t("titles.adminPage") }
        </div>
    );
}