import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import { useNavigate } from 'react-router';
import { MenuItem } from '@mui/material';

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
            <h1>{ t("text.adminPanel") }</h1>
            <div className='admin__wrapper'>
                <div className="admin__menu">
                    <MenuItem onClick={() => navigate("/admin/users")}>{ t("text.usersAdmin") }</MenuItem>
                    <MenuItem onClick={() => navigate("/admin")}>{ t("text.rolesAdmin") }</MenuItem>
                    <MenuItem onClick={() => navigate("/admin")}>{ t("text.permitionsRules") }</MenuItem> 
                </div>
                <div className="content">{children}</div>
            </div>
        </div>
    );
}