import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import rootStore, { StoreContext } from './stores';

const data = window.__SSR_DATA__;
delete window.__SSR_DATA__;

ReactDOM.hydrateRoot(
    document.getElementById('root'),
    <BrowserRouter>
        <StoreContext.Provider value={ rootStore }>
            <App data={ data } />
        </StoreContext.Provider>
    </BrowserRouter>,
);
