import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate, matchPath } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { adminRoutes, routes } from './routes.js';
import { useStore } from './stores';
import usePermissions from './helpers/permissions-helpers.ts';
import ChatWrapper from './components/partials/chat/chat-wrapper.tsx';
import Notification from './components/partials/notification/notification.tsx';
import $api from './configs/axiosconfig/axios';
import './stylesheets/application.scss';
import './stylesheets/themes/dark.scss';
import './stylesheets/themes/white.scss';

function App({ data }: { data: { url: string, ssrData: any } | null }) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const { userStore } = useStore();
    const { checkPermissions } = usePermissions();


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

    /*useEffect(() => {
        const allStylesPackage = document.getElementById("all_style_package");
        if (allStylesPackage) {
            const head = document.getElementsByTagName("head")[0];
            head.removeChild(allStylesPackage);
        }
    }, []);*/

    return (
        <>
            <div className='home-page-main'>
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
