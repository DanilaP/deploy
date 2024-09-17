import { useState } from 'react';
import './stylesheets/application.scss';
import { useTranslation } from './translation/i18n';

import { adminRoutes, routes } from './routes';
import { Route, Routes, Link, Navigate } from 'react-router-dom';

function App() {
    const [authorized, setAuthorized] = useState(true);
    const { t } = useTranslation();
    return (
        <> 
          <div>
              <div>
                    <Link to='/'>{t('titles.homePage')}</Link><br/>
                    <Link to='/about'>{t('titles.aboutPage')}</Link><br/>
                    <Link to='/auth/signIn'>{t('titles.signIn')}</Link><br/>
                    <Link to='/auth/signUp'>{t('titles.signUp')}</Link><br/>
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
                        { 
                            adminRoutes.map(({ path, component: C }) => (
                                <Route key={path} path={path} element={authorized ? (<C/>) : <Navigate to={"/auth"} />} />
                            ))
                        }
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
