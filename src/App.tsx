import { useState } from 'react';
import './stylesheets/application.scss';
import { useTranslation } from './translation/i18n';

import { adminRoutes, routes } from './routes';
import { Route, Routes, Link, Navigate } from 'react-router-dom';

function App() {
    const [authorized, setAuthorized] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);

    const { t } = useTranslation();
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
                </div>
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
        </>
    );
}

export default App;
