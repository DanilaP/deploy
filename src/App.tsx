import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './stylesheets/application.scss'
import { useTranslation } from './translation/i18n'

import routes from './routes';
import { Route, Routes, Link } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
  const { t } = useTranslation();
  return (
    <> 
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div>
          <div className='test-block'>
              <b>Sass test text is green</b>
          </div>
          <div>
              i18n test 'loading' label text: { t('labels.loading') }
          </div>
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
              </Routes>
          </div>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
