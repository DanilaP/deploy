import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import rootStore, { StoreContext } from './stores';

const data = window.__SSR_DATA__;
const skipHydartion = window.__HYDRATION__?.skipHydration;
delete window.__SSR_DATA__;

if (skipHydartion) {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <BrowserRouter>
        <StoreContext.Provider value={ rootStore }>
          <App data={ data } />
        </StoreContext.Provider>
      </BrowserRouter>,
    );
} else {
    ReactDOM.hydrateRoot(
        document.getElementById('root'),
        <BrowserRouter>
            <StoreContext.Provider value={ rootStore }>
                <App data={ data } />
            </StoreContext.Provider>
        </BrowserRouter>,
    );
}
