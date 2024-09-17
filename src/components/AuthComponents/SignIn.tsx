import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';


export default function SignIn () {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.signIn");
    });
    return (
        <div>
            { t("titles.signIn") }
        </div>
    );
}