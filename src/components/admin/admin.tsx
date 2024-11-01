import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { useNavigate } from 'react-router';
import { MenuItem } from '@mui/material';
import { SupervisedUserCircle, ShoppingCart, SupervisorAccount, Security } from '@material-ui/icons';
import './admin.scss';
import usePermissions from "../../helpers/permissions-helpers.ts";

interface AdminPageProps {
    children: React.ReactElement | null
}

export default function AdminPage (props: AdminPageProps) {
    const { t } = useTranslation();
    const { children } = props;
    const navigate = useNavigate();
    const [isMenuTextExists, setIsMenuTextExists] = useState(false);

    const { checkConcretePermissions } = usePermissions();
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
                            <SupervisedUserCircle />{ !isMenuTextExists ? t("text.usersAdmin") : null }
                        </MenuItem> : null
                    }
                    {
                        permissionsExists.CreateRoles || permissionsExists.DeleteRoles || permissionsExists.ModifyRoles ?
                        <MenuItem onClick={ () => navigate("/admin/roles")}>
                            <SupervisorAccount />{ !isMenuTextExists ?  t("text.rolesAdmin") : null }
                        </MenuItem> : null
                    }
                    {
                        permissionsExists.CreateGroupOfPermissions || permissionsExists.DeleteGroupOfPermissions || permissionsExists.ModifyGroupOfPermissions ?
                        <MenuItem onClick={ () => navigate("/admin/permissions")}>
                            <Security />{ !isMenuTextExists ? t("titles.permissionsPage") : null }
                        </MenuItem>  : null
                    }
                    {
                        permissionsExists.CreateGroupOfPermissions || permissionsExists.DeleteGroupOfPermissions || permissionsExists.ModifyGroupOfPermissions ? 
                        <MenuItem onClick={ () => navigate("/admin/goods")}>
                            <ShoppingCart />{ !isMenuTextExists ? t("titles.goodsPage") : null }
                        </MenuItem>  : null
                    }
                </div>
                <div className="content">{ children }</div>
            </div>
        </div>
    );
}
