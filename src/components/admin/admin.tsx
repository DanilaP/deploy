import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { useNavigate } from 'react-router';
import { MenuItem } from '@mui/material';
import { MdSupervisedUserCircle } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";

import './admin.scss';
import { checkConcretePermissions } from '../../helpers/permissions-helpers';

interface AdminPageProps {
    children: React.ReactElement | null
}

export default function AdminPage (props: AdminPageProps) {

    const { t } = useTranslation();
    const { children } = props;
    const navigate = useNavigate();
    const [isMenuTextExists, setIsMenuTextExists] = useState(false);
    const permissionsExists = checkConcretePermissions();

    useEffect(() => {
        document.title = t("titles.adminPage");
    });

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth <= 820) {
                setIsMenuTextExists(true);
            } else {
                setIsMenuTextExists(false);
            }
        });
    }, []);

    return (
        <div className='admin-page-main'>
            <div className='admin-wrapper'>
                <div className="admin-menu">
                    {
                        permissionsExists.CreateUsers || permissionsExists.DeleteUsers || permissionsExists.ModifyUsers ? 
                        <MenuItem onClick={ () => navigate("/admin/users")}>
                            <MdSupervisedUserCircle className='icon' />{ !isMenuTextExists ? t("text.usersAdmin") : null }
                        </MenuItem> : null
                    }
                    {
                        permissionsExists.CreateRoles || permissionsExists.DeleteRoles || permissionsExists.ModifyRoles ? 
                        <MenuItem onClick={ () => navigate("/admin/roles")}>
                            <FaUsersCog className='icon' />{ !isMenuTextExists ?  t("text.rolesAdmin") : null }
                        </MenuItem> : null
                    }
                    {
                        permissionsExists.CreateGroupOfPermissions || permissionsExists.DeleteGroupOfPermissions || permissionsExists.ModifyGroupOfPermissions ? 
                        <MenuItem onClick={ () => navigate("/admin/permissions")}>
                            <MdOutlineSecurity className='icon' />{ !isMenuTextExists ? t("titles.permissionsPage") : null }
                        </MenuItem>  : null
                    }
                    
                </div>
                <div className="content">{ children }</div>
            </div>
        </div>
    );
}