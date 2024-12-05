import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../../translation/i18n';
import './auth-pages.scss';
import { Button } from '@mui/material';
import { MdExitToApp } from "react-icons/md";

interface AuthLayoutProps {
    children: React.ReactElement | null
}
export default function AuthLayout (props: AuthLayoutProps) {

    const { t } = useTranslation();
    const { children } = props;

    useEffect(() => {
        document.title = t("titles.authPage");
    }, []);

    return (
        <div className='auth-wrapper'>
            <div className="auth-form">
                <div className="auth-form-header">
                    <MdExitToApp className='icon' color='primary' />
                </div>
                <div className="auth-form-content">{ children }</div>
                <div className="auth-form-footer">
                    <Button>{ t("titles.forgetPasswordButton") }</Button>
                </div>
            </div>
        </div>
    );
}