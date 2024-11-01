import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import rootStore, { StoreContext } from './stores';

ReactDOM.hydrateRoot(
    document.getElementById('root'),
    <BrowserRouter>
        <StoreContext.Provider value={rootStore}>
                <App />
        </StoreContext.Provider>
    </BrowserRouter>,
);
