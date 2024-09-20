import { useEffect, useState } from 'react';
import { useTranslation } from './translation/i18n';
import { adminRoutes, routes } from './routes';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import './stylesheets/application.scss';
import './stylesheets/themes.scss';
import { Switch } from '@mui/material';

function App() {
    const [authorized, setAuthorized] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);
    const [theme, setTheme] = useState("white_theme");

    const { t } = useTranslation();

    const changeTheme = () => {
        const newTheme = theme === "white_theme" ? "dark_theme" : "white_theme";
        document.body.className = newTheme;
        setTheme(newTheme);
    };

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        document.body.className = theme ? theme : "white_theme";
    }, []);

    return (
        <> 
            <div className='homePage__main'>
                <div className="header">
                    <Link to='/'>{t('titles.homePage')}</Link><br/>
                    <Link to='/about'>{t('titles.aboutPage')}</Link><br/>
                    <Link to='/auth/signIn'>{t('titles.signIn')}</Link><br/>
                    <Link to='/auth/signUp'>{t('titles.signUp')}</Link><br/>
                    <Link to='/shop'>{t('titles.shopPage')}</Link><br/>
                    { isAdmin ? <Link to='/admin'>{t('titles.adminPage')}</Link> : null }<br/>
                    <div className="changeTheme">
                        <p>Светлая тема</p>
                        <Switch onChange = {changeTheme} defaultChecked/>
                    </div>
                </div>
                <div className="content">
                    <Routes>
                        {
                            routes.map(({ path, component: Component, children: Children }) => (
                                <Route 
                                    key={path} 
                                    path={path} 
                                    element={<Component>{Children && <Children />}</Component>}
                                />
                            ))
                        }
                        { isAdmin && 
                            adminRoutes.map(({ path, component: C }) => (
                                <Route key={path} path={path} element={authorized ? (<C/>) : <Navigate to={"/auth/signIn"} />} />
                            ))
                        }
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
