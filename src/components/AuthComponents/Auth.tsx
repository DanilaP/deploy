import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';


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
            <div className="header">Header</div>
            <div className="content">{children}</div>
            <div className="footer">Footer</div>
        </div>
    );
}