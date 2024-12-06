import NotFoundComponent from "./components/pages/service/404.tsx";
import SignIn from "./components/pages/auth/sign-in/sign-in.tsx";
import SignUp from "./components/pages/auth/sign-up/sign-up.tsx";
import AboutPage from "./components/pages/about/about.tsx";
import ShopPage from "./components/pages/shop/shop.tsx";
import CartPage from "./components/pages/cart-page/cart-page.tsx";
import UsersList from "./components/pages/admin/users/users-list/users-list.tsx";
import ProfilePage from "./components/pages/profile/profile.tsx";
import RolesPage from "./components/pages/admin/roles/roles.tsx";
import PermissionsPage from "./components/pages/admin/permissions/permissions.tsx";
import { GoodsPage } from "./components/pages/admin/goods/goods.tsx";
import ProductPage from "./components/pages/shop/product-page/product-page.tsx";
import ProductReviews from "./components/pages/shop/product-reviews-page/product-reviews-page.tsx";
import CheckoutPage from "./components/pages/checkout/checkout-page.tsx";
import { CategoriesPage } from "./components/pages/admin/categories/categories.tsx";
import { t } from "i18next";
import ProvidersPage from "./components/pages/admin/providers/providers.tsx";
import Favorites from "./components/pages/favorites/favorites.tsx";
import Chats from "./components/pages/admin/chats/chats.tsx";
import FeedBackPage from "./components/pages/feed-back/feed-back.tsx";
import AdminFeedbackPage from "./components/pages/admin/feed-back/feed-back.tsx";
import OrdersPage from "./components/pages/orders-page/orders-page.tsx";
import OrderPage from "./components/pages/order-page/order-page.tsx";
import ProductsWarehouse from "./components/pages/admin/warehouses-page/products-warehouse.tsx";
import AdminLayout from "./components/layouts/admin-layout/admin.tsx";
import AuthLayout from "./components/layouts/auth-layout/auth.tsx";

export const routes = [
    {
        path: '/about',
        component: AboutPage,
        children: null,
        breadcrumb : t("breadcrumbs.about")
    },
    {
        path: '/auth/signin',
        component: AuthLayout,
        children: SignIn,
        breadcrumb : ''
    },
    {
        path: '/auth/signup',
        component: AuthLayout,
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
        breadcrumb : t("breadcrumbs.checkout")
    },
    {
        path: "/checkout/product/:id",
        component: ProductPage,
        children: null,
        breadcrumb : t("breadcrumbs.shopProduct")
    },
    {
        path: "/cart/checkout",
        component: CheckoutPage,
        children: null,
        breadcrumb : t("breadcrumbs.checkout")
    },
    {
        path: "/cart/product/:id",
        component: ProductPage,
        children: null,
        breadcrumb : t("breadcrumbs.shopProduct")
    },
    {
        path: "/cart/product/:id/reviews",
        component: ProductReviews,
        children: null,
        breadcrumb : t("breadcrumbs.productReviews")
    },

    {
        path: "/cart/checkout/product/:id",
        component: ProductPage,
        children: null,
        breadcrumb : t("breadcrumbs.shopProduct")
    },
    {
        path: "/cart/checkout/product/:id/reviews",
        component: ProductReviews,
        children: null,
        breadcrumb : t("breadcrumbs.productReviews")
    },
    {
        path: '/orders',
        component: OrdersPage,
        children: null,
        breadcrumb : t("breadcrumbs.orders")
    },
    {
        path: "/orders/order/:id",
        component: OrderPage,
        children: null,
        breadcrumb : t("breadcrumbs.order")
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
        component: AdminLayout,
        children: null,
        breadcrumb : t("breadcrumbs.adminPage")
    },
    {
        path: '/admin/users',
        component: AdminLayout,
        children: UsersList,
        breadcrumb : t("breadcrumbs.adminUsers")
    },
    {
        path: '/admin/roles',
        component: AdminLayout,
        children: RolesPage,
        breadcrumb : t("breadcrumbs.adminRoles")
    },
    {
        path: '/admin/permissions',
        component: AdminLayout,
        children: PermissionsPage,
        breadcrumb : t("breadcrumbs.adminPermissions")
    },
    {
        path: '/admin/goods',
        component: AdminLayout,
        children: GoodsPage,
        breadcrumb : t("titles.goodsPage")
    },
    {
        path: '/admin/productsWarehouse',
        component: AdminLayout,
        children: ProductsWarehouse,
        breadcrumb : t("titles.productsStorePage")
    },
    {
        path: '/admin/categories',
        component: AdminLayout,
        children: CategoriesPage,
        breadcrumb : t("text.categories")
    },
    {
        path: '/admin/chats',
        component: AdminLayout,
        children: Chats,
        breadcrumb : "Чаты"
    },
    {
        path: '/admin/feedback',
        component: AdminLayout,
        children: AdminFeedbackPage,
        breadcrumb : t("text.feedback")
    },
    {
        path: '/admin/providers',
        component: AdminLayout,
        children: ProvidersPage,
        breadcrumb : t("text.providers")
    },
];
