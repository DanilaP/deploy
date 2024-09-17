import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';

interface AdminPageProps {
    children: React.ReactElement | null
}

export default function AdminPage (props: AdminPageProps) {

    const { t } = useTranslation();
    const { children } = props;

    useEffect(() => {
        document.title = t("titles.adminPage");
    });

    return (
        <div className='adminPage__main'>
            <div className="admin__menu">
                <div className="item">Пунк меню 1</div>
                <div className="item">Пунк меню 2</div>
                <div className="item">Пунк меню 3</div>
            </div>
            <div className="content">Контент: {children}</div>
        </div>
    );
}