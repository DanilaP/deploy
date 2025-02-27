import { Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { MdFavoriteBorder, MdPersonPin, MdPhoneCallback, MdSupervisorAccount } from "react-icons/md";
import { RiArchiveLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useStore } from "../../../stores";
import usePermissions from "../../../helpers/permissions-helpers";
import Loader from "../loader/loader";
import "./header.scss";

export default function Header() {

    const [theme, setTheme] = useState("white-theme");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { t } = useTranslation();
    const { checkPermissions } = usePermissions();
    const { userStore } = useStore();

    const changeTheme = () => {
        const newTheme = theme === "white-theme" ? "dark-theme" : "white-theme";
        document.body.className = newTheme;
        setTheme(newTheme);
    };

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        document.body.className = theme ? theme : "white-theme";
    }, []);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1335);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (userStore.user) {
        return (
            <div className="header">
                <Link to='/cart'><FaShoppingBag className='icon' />{ !isMobile ? t('titles.cart') : null }</Link><br/>
                <Link to='/shop'><FaShoppingCart className='icon' />{ !isMobile ? t('titles.shopPage') : null }</Link><br/>
                <Link to='/profile'><MdPersonPin className='icon' />{ !isMobile ? t('titles.profilePage') : null }</Link><br/>
                <Link to='/favorites'>
                    <MdFavoriteBorder className='icon' />
                    { !isMobile ? t('breadcrumbs.favorites') : null }
                </Link><br/>
                <Link to='/feedback'><MdPhoneCallback className='icon' />{ !isMobile ? t('text.feedback') : null }</Link><br/>
                <Link to='/orders'><RiArchiveLine className='icon' />{ !isMobile ? t('breadcrumbs.orders') : null }</Link><br/>
                { (checkPermissions() && userStore.user?.isVerified) ?
                (<Link to='/admin'><MdSupervisorAccount className='icon' />{ !isMobile ? t('titles.adminPage') : null }</Link>) : null }<br/>
                <div className="change-theme">
                    <p>{ theme === "white-theme" ? "Светлая тема" : "Темная тема" }</p>
                    <Switch onChange = { changeTheme } defaultChecked/>
                </div>
            </div>
        );
    } else {
        return <Loader />;
    }
}