import NotFoundComponent from "./components/service/404";
import AdminPage from "./components/admin/admin";
import AuthPage from "./components/auth/auth";
import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/sign-up/sign-up";
import AboutPage from "./components/about/about";
import ShopPage from "./components/shop/shop";
import UsersList from "./components/admin/users/users-list/users-list";
import ProfilePage from "./components/profile/profile";
import RolesPage from "./components/admin/roles/roles";
import PermissionsPage from "./components/admin/permissions/permissions";
import ProductPage from "./components/shop/product-page/product-page";
import ProductReviews from "./components/shop/product-reviews-page/product-reviews-page";

export const routes = [
    {
        path: '/about',
        component: AboutPage,
        children: null,
        breadcrumb : 'О проекте'
    },
    {
        path: '/auth/signin',
        component: AuthPage,
        children: SignIn,
        breadcrumb : 'Авторизация'
    },
    {
        path: '/auth/signup',
        component: AuthPage,
        children: SignUp,
        breadcrumb : 'Регистрация'
    },
    {
        path: '/shop',
        component: ShopPage,
        children: null,
        breadcrumb : 'Магазин'
    },
    {
        path: '/profile',
        component: ProfilePage,
        children: null,
        breadcrumb : 'Профиль'
    },
    {
        path: "/shop/product/:id",
        component: ProductPage,
        children: null,
        breadcrumb : `Продукт`
    },
    {
        path: "/shop/product/:id/reviews",
        component: ProductReviews,
        children: null,
        breadcrumb : `Отзывы о продукте`
    },
    {
        path: '*',
        component: NotFoundComponent,
        children: null,
        breadcrumb : ''
    }
];

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminPage,
        children: null,
        breadcrumb : 'Страница администрации'
    },
    {
        path: '/admin/users',
        component: AdminPage,
        children: UsersList,
        breadcrumb : 'Страница пользователей'
    },
    {
        path: '/admin/roles',
        component: AdminPage,
        children: RolesPage,
        breadcrumb : 'Страница ролей'
    },
    {
        path: '/admin/permissions',
        component: AdminPage,
        children: PermissionsPage,
        breadcrumb : 'Страница прав'
    },
];