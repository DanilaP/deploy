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
                    router test:<br/>
                    <Link to='/'>{t('titles.homePage')}</Link><br/>
                    <Link to='/about'>{t('titles.aboutPage')}</Link><br/>
                    <Link to='/custom/1'>custom 1</Link><br/>
                    <Link to='/custom/2'>custom 2</Link><br/>
                    router view:
                    <Routes>
                        {
                            routes.map(({ path, component: C }) => (
                                <Route key={path} path={path} element={<C />} />
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
