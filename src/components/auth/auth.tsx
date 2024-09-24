import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import '../../stylesheets/authpages.scss';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

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
            <div className="header">
                <Link to='/auth/signIn'>{ t('titles.signIn') }</Link>
                <Link to='/auth/signUp'>{ t('titles.signUp') }</Link>
            </div>
            <div className="content">{children}</div>
            <div className="footer">
                <Button>{ t("titles.forgetPasswordButton") }</Button>
            </div>
        </div>
    );
}