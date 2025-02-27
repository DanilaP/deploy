import { useEffect, useState } from 'react';
import { useTranslation } from '../../../translation/i18n.ts';
import { useNavigate } from 'react-router';
import { MenuItem } from '@mui/material';
import { MdOutlineWysiwyg, MdSupervisedUserCircle } from "react-icons/md";
import { FaFileInvoiceDollar, FaUsersCog, FaWarehouse } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";
import { FaListCheck } from "react-icons/fa6";
import './admin.scss';
import usePermissions from "../../../helpers/permissions-helpers.ts";
import { TbTruckDelivery } from "react-icons/tb";
import { RiDiscountPercentLine } from 'react-icons/ri';
import { IoMdStats } from 'react-icons/io';
import Header from '../../partials/header/header.tsx';
import BreadCrumbs from '../../pages/breadcrumbs/bread-crumbs.tsx';
import { useStore } from '../../../stores/index.ts';

interface AdminLayoutProps {
    children: React.ReactElement | null
}

export default function AdminLayout (props: AdminLayoutProps) {
    const { t } = useTranslation();
    const { children } = props;
    const navigate = useNavigate();
    const [isMenuTextExists, setIsMenuTextExists] = useState(false);

    const { checkConcretePermissions } = usePermissions();
    const permissionsExists = checkConcretePermissions();
    const { userStore } = useStore();
    
    useEffect(() => {
        document.title = t("titles.adminPage");
    });

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth <= 1335) {
                setIsMenuTextExists(true);
            } else {
                setIsMenuTextExists(false);
            }
        });
    }, []);

    return (
        <div className='admin-page-main'>
            <Header />
            { userStore.user ? <BreadCrumbs /> : null }
            <div className='admin-wrapper'>
                <div className="admin-menu">
                    {
                        permissionsExists.CreateUsers || permissionsExists.DeleteUsers || permissionsExists.ModifyUsers ?
                        <MenuItem onClick={ () => navigate("/admin/users") }>
                            <MdSupervisedUserCircle className='icon' />{ !isMenuTextExists ? t("text.usersAdmin") : null }
                        </MenuItem> : null
                    }
                    {
                        permissionsExists.CreateRoles || permissionsExists.DeleteRoles || permissionsExists.ModifyRoles ?
                        <MenuItem onClick={ () => navigate("/admin/roles") }>
                            <FaUsersCog className='icon' />{ !isMenuTextExists ?  t("text.rolesAdmin") : null }
                        </MenuItem> : null
                    }
                    {
                        permissionsExists.CreateGroupOfPermissions || permissionsExists.DeleteGroupOfPermissions || permissionsExists.ModifyGroupOfPermissions ?
                        <MenuItem onClick={ () => navigate("/admin/permissions") }>
                            <MdOutlineSecurity className='icon' />{ !isMenuTextExists ? t("titles.permissionsPage") : null }
                        </MenuItem>  : null
                    }
                    {
                        permissionsExists.CreateGroupOfPermissions || permissionsExists.DeleteGroupOfPermissions || permissionsExists.ModifyGroupOfPermissions ? 
                        <MenuItem onClick={ () => navigate("/admin/goods") }>
                            <FaShoppingCart className='icon' />{ !isMenuTextExists ? t("titles.goodsPage") : null }
                        </MenuItem>  : null
                    }
                    {
                        <MenuItem onClick={ () => navigate("/admin/productsWarehouse") }>
                            <FaWarehouse className='icon'/>{ !isMenuTextExists ? t("titles.productsStorePage") : null }
                        </MenuItem>
                    }
                    {
                        permissionsExists.CreateGroupOfPermissions || permissionsExists.DeleteGroupOfPermissions || permissionsExists.ModifyGroupOfPermissions ? 
                        <MenuItem onClick={ () => navigate("/admin/categories") }>
                            <MdCategory className='icon' />{ !isMenuTextExists ? t("text.categories") : null }
                        </MenuItem>  : null
                    }
                    {
                        <MenuItem onClick={ () => navigate("/admin/chats") }>
                            <BsChatDotsFill className='icon'/>{ !isMenuTextExists ? "Чаты" : null }
                        </MenuItem>
                    }
                    {    <MenuItem onClick={ () => navigate("/admin/feedback") }>
                            <FaListCheck className='icon' />{ !isMenuTextExists ? t("text.feedback") : null }
                        </MenuItem>
                    }
                    {
                        permissionsExists.WathingProviders &&
                        <MenuItem onClick={ () => navigate("/admin/providers") }>
                            <TbTruckDelivery className='icon' />{ !isMenuTextExists ? t("text.providers") : null }
                        </MenuItem>
                    }
                    {
                        <MenuItem onClick={ () => navigate("/admin/productAccounting") }>
                            <FaFileInvoiceDollar className='icon'/>{ !isMenuTextExists ? t("titles.productAccounting") : null }
                        </MenuItem>
                    }
                    {   
                        <MenuItem onClick={ () => navigate("/admin/discounts") }>
                            <RiDiscountPercentLine className='icon' />{ !isMenuTextExists ? t("text.discounts") : null }
                        </MenuItem>
                    }
                    {   
                        <MenuItem onClick={ () => navigate("/admin/statistic") }>
                            <IoMdStats className='icon' />{ !isMenuTextExists ? t("text.statistic") : null }
                        </MenuItem>
                    }
                    {   
                        <MenuItem onClick={ () => navigate("/admin/static-page-generator") }>
                            <MdOutlineWysiwyg className='icon' />{ !isMenuTextExists ? t("text.staticPageGenerator") : null }
                        </MenuItem>
                    }
                </div>
                <div className="content">{ children }</div>
            </div>
        </div>
    );
}
