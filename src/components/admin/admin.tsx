import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { useNavigate } from 'react-router';
import { MenuItem } from '@mui/material';
import { SupervisedUserCircle, SupervisorAccount, Security } from '@material-ui/icons';
import './admin.scss';

interface AdminPageProps {
    children: React.ReactElement | null
}

export default function AdminPage (props: AdminPageProps) {

    const { t } = useTranslation();
    const { children } = props;
    const navigate = useNavigate();
    const [isMenuTextExists, setIsMenuTextExists] = useState(false);

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
                    <MenuItem onClick={ () => navigate("/admin/users")}>
                        <SupervisedUserCircle />{ !isMenuTextExists ? t("text.usersAdmin") : null }
                    </MenuItem>
                    <MenuItem onClick={ () => navigate("/admin/roles")}>
                        <SupervisorAccount />{ !isMenuTextExists ?  t("text.rolesAdmin") : null }
                    </MenuItem>
                    <MenuItem onClick={ () => navigate("/admin")}>
                        <Security />{ !isMenuTextExists ? t("text.permitionsRules") : null }
                    </MenuItem> 
                </div>
                <div className="content">{ children }</div>
            </div>
        </div>
    );
}