import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import '../../stylesheets/authpages.scss';
import { Button } from '@mui/material';

interface AuthPageProps {
    children: React.ReactElement | null
}
export default function AuthPage (props: AuthPageProps) {

    const { t } = useTranslation();
    const { children } = props;

    useEffect(() => {
        document.title = t("titles.authPage");
    });

    return (
        <div className='auth__wrapper'>
            <div className="header"></div>
            <div className="content">{children}</div>
            <div className="footer">
                <Button>{t("titles.forgetPasswordButton")}</Button>
            </div>
        </div>
    );
}