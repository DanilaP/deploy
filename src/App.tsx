import { useEffect, useState } from 'react';
import { useTranslation } from './translation/i18n';
import { adminRoutes, routes } from './routes';
import { Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import './stylesheets/application.scss';
import './stylesheets/themes/dark.scss';
import './stylesheets/themes/white.scss';
import { Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import $api from './configs/axiosconfig/axios';
import { store } from './store';
import { PersonPin } from '@material-ui/icons';
import { ShoppingCart } from '@material-ui/icons';
import { SupervisorAccount } from '@material-ui/icons';

function App() {
    const [theme, setTheme] = useState("white-theme");
    const currentStore = useSelector((store: any) => store);
    const navigate = useNavigate();

    const { t } = useTranslation();

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
            store.dispatch({ type: "USER", payload: res.data.user[0] });
        })
        .catch((error) => {
            console.log(error);
            navigate("/auth/signin");
        });
    }, []);

    return (
        <> 
            <div className='home-page-main'>
                <div className="header">
                    { currentStore.user ? (
                        <>
                            <Link to='/shop'><ShoppingCart/>{ t('titles.shopPage') }</Link><br/>
                            <Link to='/profile'><PersonPin />{ t('titles.profilePage') }</Link><br/>
                            { currentStore.user?.role === "Администратор" ? 
                            (<Link to='/admin'><SupervisorAccount/>{ t('titles.adminPage') }</Link>) : null }<br/>
                            <div className="change-theme">
                                <p>{ theme === "white-theme" ? "Светлая тема" : "Темная тема" }</p>
                                <Switch onChange = { changeTheme } defaultChecked/>
                            </div>
                        </> ) : null
                    }
                </div>
                <div className="content">
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
                        { currentStore.user?.role === "Администратор" && 
                            adminRoutes.map(({ path,  component: Component, children: Children }) => (
                                <Route 
                                    key={ path } 
                                    path={ path }
                                    element={ currentStore.user ? <Component>{ Children && <Children /> }</Component> : <Navigate to={ "/auth/signIn" } /> } 
                                />
                            ))
                        }
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
