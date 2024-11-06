import NotFoundComponent from "./components/service/404";
import AdminPage from "./components/admin/admin";
import AuthPage from "./components/auth/auth";
import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/sign-up/sign-up";
import AboutPage from "./components/about/about";
import HomePage from "./components/home/home";
import ShopPage from "./components/shop/shop";
import CartPage from "./components/cart/cart-page.tsx";
import UsersList from "./components/admin/users/users-list/users-list";
import ProfilePage from "./components/profile/profile";
import RolesPage from "./components/admin/roles/roles";
import PermissionsPage from "./components/admin/permissions/permissions";
import { GoodsPage } from "./components/admin/goods/goods";
import ProductPage from "./components/shop/product-page/product-page";
import ProductReviews from "./components/shop/product-reviews-page/product-reviews-page";
import CheckoutPage from "./components/checkout/checkout-page.tsx";

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
        path: '/cart',
        component: CartPage,
        children: null
    },
    {
        path: '/checkout',
        component: CheckoutPage,
        children: null
    },
    {
        path: '/profile',
        component: ProfilePage,
        children: null
    },
    {
        path: "/product/:id",
        component: ProductPage,
        children: null
    },
    {
        path: "/product/:id/reviews",
        component: ProductReviews,
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
    {
        path: '/admin/users',
        component: AdminPage,
        children: UsersList
    },
    {
        path: '/admin/roles',
        component: AdminPage,
        children: RolesPage
    },
    {
        path: '/admin/permissions',
        component: AdminPage,
        children: PermissionsPage
    },
    {
        path: '/admin/goods',
        component: AdminPage,
        children: GoodsPage
    },
];
