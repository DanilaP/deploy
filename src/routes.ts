import HomePageComponent from "./components/pages/home";
import AboutPageComponent from "./components/pages/about";
import NotFoundComponent from "./components/pages/404";
import AdminPage from "./components/pages/Admin";
import AuthPage from "./components/Auth";

export const routes = [
    {
        path: '/',
        component: HomePageComponent,
    },
    {
        path: '/about',
        component: AboutPageComponent,
    },
    {
        path: '/auth',
        component: AuthPage,
    },
    {
        path: '*',
        component: NotFoundComponent,
    }
];

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminPage,
    },
]