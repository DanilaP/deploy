import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from './translation/i18n';
import { Route, Routes, Link, Navigate, useNavigate, matchPath } from 'react-router-dom';
import { Switch } from '@mui/material';
import { FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdPersonPin } from "react-icons/md";
import { MdSupervisorAccount } from "react-icons/md";
import { observer } from 'mobx-react-lite';
import { MdPhoneCallback } from "react-icons/md";
import { RiArchiveLine } from "react-icons/ri";
import { adminRoutes, routes } from './routes.js';
import { useStore } from './stores';
import { MdFavoriteBorder } from "react-icons/md";
import usePermissions from './helpers/permissions-helpers.ts';
import BreadCrumbs from './components/pages/breadcrumbs/bread-crumbs.tsx';
import ChatWrapper from './components/partials/chat/chat-wrapper.tsx';
import Notification from './components/partials/notification/notification.tsx';
import $api from './configs/axiosconfig/axios';
import './stylesheets/application.scss';
import './stylesheets/themes/dark.scss';
import './stylesheets/themes/white.scss';

function App({ data }: { data: { url: string, ssrData: any } | null }) {

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
            setIsMobile(window.innerWidth <= 1335);
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

            socket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                userStore.setChatInfo(data);
                userStore.setNotification({ 
                    text: data.messages[data.messages.length - 1].text, 
                    senderId:  data.messages[data.messages.length - 1].senderId
                });
                setTimeout(() => userStore.setNotification(null), 2500);
            };

            socket.onerror = function(error) {
                console.error(`Ошибка: ${ error }`);
            };
        }
    }, [userStore.user]);

    return (
        <>
            <div className='home-page-main'>
                { userStore.user && userStore.user.favorites ? (
                    <div className="header">
                        <Link to='/static/1'>{ t("text.static1") }</Link><br/>
                        <Link to='/static/2'>{ t("text.static2") }</Link><br/>
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
                    </div> ) : null
                }
                { /*userStore.user ? <BreadCrumbs /> : null*/ }
                <div className="content">
                    <Routes>
                        {
                            routes.map(({ path, component: Component, children: Children }) => {
                                const isDataFetched = data && matchPath(path, data.url);
                                return (
                                    <Route
                                        key={ path }
                                        path={ path }
                                        element={ 
                                            <Component>
                                                { Children && <Children data={ isDataFetched ? data : null } /> }
                                            </Component> 
                                        }
                                    />
                                );
                            })
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
                </div>
                { (isLoading && userStore.user && !checkPermissions()) ? <ChatWrapper /> : null }
                {
                    !userStore.isChatOpen 
                    ?
                        (userStore.notification && userStore.notification.senderId !== Number(userStore?.user?.id) )
                            ? <Notification notification={ userStore.notification } />
                            : null 
                    : null
                }
            </div>
        </>
    );
}

export default observer(App);
