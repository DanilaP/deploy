import { useEffect, useState } from 'react';
import { useTranslation } from './translation/i18n';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';
import $api from './configs/axiosconfig/axios';
import { FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdPersonPin } from "react-icons/md";
import { MdSupervisorAccount } from "react-icons/md";
import { observer } from 'mobx-react-lite';
import './stylesheets/application.scss';
import './stylesheets/themes/dark.scss';
import './stylesheets/themes/white.scss';
import { adminRoutes, routes } from './routes';
import { useStore } from './stores';
import usePermissions from './helpers/permissions-helpers.ts';
import BreadCrumbs from './components/breadcrumbs/bread-crumbs.tsx';
import { MdFavoriteBorder } from "react-icons/md";
import ChatWrapper from './components/chat/chat-wrapper.tsx';

function App() {
    const [theme, setTheme] = useState("white-theme");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const { t } = useTranslation();

    const { userStore } = useStore();
    const { checkPermissions } = usePermissions();

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
        $api.get("/profile")
        .then((res) => {
            userStore.setUser(res.data.user[0]);
            userStore.setPermissions(res.data.permissions);
            setIsLoading(true);
        })
        .catch((error) => {
            console.log(error);
            navigate("/auth/signin");
            setIsLoading(true);
        });
    }, []);

    useEffect(() => {
        $api.get("/permissions")
        .then((res) => {
            userStore.setAllPermissions(res.data.permissions);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1100);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            const socket = new WebSocket('ws://localhost:5000', token);
            userStore.setSocketConnection(socket);
            
            socket.onopen = function() {
                console.log('Соединение установлено');
            };

            socket.onerror = function(error) {
                console.error(`Ошибка: ${ error }`);
            };
        }
    }, []);

    return (
        <>
            <div className='home-page-main'>
                    { userStore.user && userStore.user.favorites ? (
                        <div className="header">
                            <Link to='/cart'><FaShoppingBag className='icon' />{ !isMobile ? t('titles.cart') : null }</Link><br/>
                            <Link to='/shop'><FaShoppingCart className='icon' />{ !isMobile ? t('titles.shopPage') : null }</Link><br/>
                            <Link to='/profile'><MdPersonPin className='icon' />{ !isMobile ? t('titles.profilePage') : null }</Link><br/>
                            <Link to='/favorites'>
                                <MdFavoriteBorder className='icon' />
                                { `(${ userStore.user.favorites?.length }) ` }{ !isMobile ? t('breadcrumbs.favorites') : null }
                            </Link><br/>
                            { (checkPermissions() && userStore.user?.isVerified) ?
                            (<Link to='/admin'><MdSupervisorAccount className='icon' />{ !isMobile ? t('titles.adminPage') : null }</Link>) : null }<br/>
                            <div className="change-theme">
                                <p>{ theme === "white-theme" ? "Светлая тема" : "Темная тема" }</p>
                                <Switch onChange = { changeTheme } defaultChecked/>
                            </div>
                        </div> ) : null
                    }
                    {
                        userStore.user ? <BreadCrumbs /> : null
                    }
                <div className="content">
                    { isLoading &&
                        <Routes>
                            {
                                routes.map(({ path, component: Component, children: Children }) => (
                                    <Route
                                        key={ path }
                                        path={ path }
                                        element={ <Component>{ Children && <Children /> }</Component> }
                                    />
                                ))
                            }
                            { (checkPermissions() && userStore.user?.isVerified) &&
                                adminRoutes.map(({ path,  component: Component, children: Children }) => (
                                    <Route
                                        key={ path }
                                        path={ path }
                                        element={ userStore.user
                                            ? <Component>{ Children && <Children /> }</Component> : <Navigate to={ "/auth/signIn" } /> }
                                    />
                                ))
                            }
                        </Routes>
                    }
                </div>
                { isLoading && userStore.user && <ChatWrapper /> }
            </div>
        </>
    );
}

export default observer(App);
