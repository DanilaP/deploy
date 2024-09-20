import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import { useNavigate } from 'react-router';

interface AdminPageProps {
    children: React.ReactElement | null
}

export default function AdminPage (props: AdminPageProps) {

    const { t } = useTranslation();
    const { children } = props;
    const navigate = useNavigate();

    useEffect(() => {
        document.title = t("titles.adminPage");
    });

    return (
        <div className='adminPage__main'>
            <div className="admin__menu"> 
                <div onClick={() => navigate("/admin/users")} className="item">{t("titles.usersPage")}</div>
            </div>
            <div className="content">{children}</div>
        </div>
    );
}