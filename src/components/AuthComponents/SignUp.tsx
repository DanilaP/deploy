import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';


export default function SignUp () {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("titles.signUp");
    });
    return (
        <div>
            { t("titles.signUp") }
        </div>
    );
}