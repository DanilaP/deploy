import NotFoundComponent from "./components/service/404";
import AdminPage from "./components/admin/admin";
import AuthPage from "./components/auth/auth";
import SignIn from "./components/auth/sign-in/sign-in";
import SignUp from "./components/auth/sign-up/sign-up";
import AboutPage from "./components/about/about";
import ShopPage from "./components/shop/shop";
import CartPage from "./components/cart/cart-page.tsx";
import UsersList from "./components/admin/users/users-list/users-list";
import ProfilePage from "./components/profile/profile";
import RolesPage from "./components/admin/roles/roles";
import PermissionsPage from "./components/admin/permissions/permissions";
import { GoodsPage } from "./components/admin/goods/goods";
import ProductPage from "./components/shop/product-page/product-page";
import ProductReviews from "./components/shop/product-reviews-page/product-reviews-page";
import { CategoriesPage } from "./components/admin/categories/categories";
import { t } from "i18next";
import CheckoutPage from "./components/checkout/checkout-page.tsx";
import Favorites from "./components/favorites/favorites";
import FeedBackPage from "./components/feed-back/feed-back.tsx";
import AdminFeedbackPage from "./components/admin/feed-back/feed-back.tsx";
import ProductsWarehouse from "./components/admin/warehouses-page/products-warehouse.tsx";

export const routes = [
    {
        path: '/about',
        component: AboutPage,
        children: null,
        breadcrumb : t("breadcrumbs.about")
    },
    {
        path: '/auth/signin',
        component: AuthPage,
        children: SignIn,
        breadcrumb : ''
    },
    {
        path: '/auth/signup',
        component: AuthPage,
        children: SignUp,
        breadcrumb : ''
    },
    {
        path: '/shop',
        component: ShopPage,
        children: null,
        breadcrumb : t("breadcrumbs.shop")
    },
    {
        path: '/cart',
        component: CartPage,
        children: null,
        breadcrumb : t("breadcrumbs.cart")
    },
    {
        path: '/checkout',
        component: CheckoutPage,
        children: null,
        breadcrumb : t("breadcrumbs.shop")
    },
    {
        path: '/profile',
        component: ProfilePage,
        children: null,
        breadcrumb : t("breadcrumbs.profile")
    },
    {
        path: "/shop/product/:id",
        component: ProductPage,
        children: null,
        breadcrumb : t("breadcrumbs.shopProduct")
    },
    {
        path: "/shop/product/:id/reviews",
        component: ProductReviews,
        children: null,
        breadcrumb : t("breadcrumbs.productReviews")
    },
    {
        path: "/favorites",
        component: Favorites,
        children: null,
        breadcrumb : t("breadcrumbs.favorites")
    },
    {
        path: "/feedback",
        component: FeedBackPage,
        children: null,
        breadcrumb : t("breadcrumbs.feedback")
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
        breadcrumb : t("breadcrumbs.adminPage")
    },
    {
        path: '/admin/users',
        component: AdminPage,
        children: UsersList,
        breadcrumb : t("breadcrumbs.adminUsers")
    },
    {
        path: '/admin/roles',
        component: AdminPage,
        children: RolesPage,
        breadcrumb : t("breadcrumbs.adminRoles")
    },
    {
        path: '/admin/permissions',
        component: AdminPage,
        children: PermissionsPage,
        breadcrumb : t("breadcrumbs.adminPermissions")
    },
    {
        path: '/admin/goods',
        component: AdminPage,
        children: GoodsPage,
        breadcrumb : t("titles.goodsPage")
    },
    {
        path: '/admin/productsWarehouse',
        component: AdminPage,
        children: ProductsWarehouse,
        breadcrumb : t("titles.productsStorePage")
    },
    {
        path: '/admin/categories',
        component: AdminPage,
        children: CategoriesPage,
        breadcrumb : t("text.categories")
    },
    {
        path: '/admin/feedback',
        component: AdminPage,
        children: AdminFeedbackPage,
        breadcrumb : t("text.feedback")
    },
];
