import NotFoundComponent from "./components/pages/ServicePages/404";
import AdminPage from "./components/pages/Admin";
import AuthPage from "./components/AuthComponents/Auth";
import SignIn from "./components/AuthComponents/SignIn";
import SignUp from "./components/AuthComponents/SignUp";
import AboutPage from "./components/pages/About";
import HomePage from "./components/pages/Home";
import ShopPage from "./components/ShopComponents/Shop";

export const routes = [
    {
        path: '/',
        component: HomePage,
        children: null
    },
    {
        path: '/about',
        component: AboutPage,
        children: null 
    },
    {
        path: '/auth/signin',
        component: AuthPage,
        children: SignIn
    },
    {
        path: '/auth/signup',
        component: AuthPage,
        children: SignUp
    },
    {
        path: '/shop',
        component: ShopPage,
        children: null
    },
    {
        path: '*',
        component: NotFoundComponent,
        children: null
    }
];

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminPage,
        children: null
    },
];