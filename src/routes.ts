import HomePageComponent from "./components/pages/home";
import AboutPageComponent from "./components/pages/about";
import CustomPageComponent from "./components/pages/custom";
import NotFoundComponent from "./components/pages/404";

const routes = [
    {
        path: '/',
        component: HomePageComponent,
    },
    {
        path: '/about',
        component: AboutPageComponent,
    },
    {
        path: '/custom/:num',
        component: CustomPageComponent,
    },
    {
        path: '*',
        component: NotFoundComponent,
    }
];
export default routes