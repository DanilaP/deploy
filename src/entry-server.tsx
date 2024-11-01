import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import rootStore, { StoreContext } from './stores';

export function render(url, context) {
    return ReactDOMServer.renderToString(
        <StaticRouter location={url} context={context}>
            <StoreContext.Provider value={rootStore}>
                <App />
            </StoreContext.Provider>
        </StaticRouter>,
    );
}
