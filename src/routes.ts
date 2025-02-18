import NotFoundComponent from "./components/pages/service/404.tsx";
import SignIn from "./components/pages/auth/sign-in/sign-in.tsx";
import SignUp from "./components/pages/auth/sign-up/sign-up.tsx";
import AboutPage from "./components/pages/about/about.tsx";
import ShopPage from "./components/pages/shop/shop.tsx";
import CartPage from "./components/pages/cart-page/cart-page.tsx";
import ProfilePage from "./components/pages/profile/profile.tsx";
import RolesPage from "./components/pages/admin/roles/roles.tsx";
import PermissionsPage from "./components/pages/admin/permissions/permissions.tsx";
import { GoodsPage } from "./components/pages/admin/goods/goods.tsx";
import ProductPage from "./components/pages/product-page/product-page.tsx";
import ProductReviews from "./components/pages/shop/product-reviews-page/product-reviews-page.tsx";
import CheckoutPage from "./components/pages/checkout-page/checkout-page.tsx";
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
import Users from "./components/pages/admin/users/users.tsx";
import ProductAccounting from "./components/pages/admin/product-accounting/product-accounting.tsx";
import DiscountsPage from "./components/pages/admin/discounts/discounts.tsx";
import { FeedBackInfoPage } from "./components/pages/admin/feed-back-info/feed-back-info.tsx";
import MainLayout from "./components/layouts/main-layout/main.tsx";
import StatisticPage from "./components/pages/admin/statistic/statistic.tsx";
import StaticPageGeneratorPage from "./components/pages/admin/static-page-generator/static-page-generator.tsx";

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
        component: MainLayout,
        children: ShopPage,
        breadcrumb : t("breadcrumbs.shop")
    },
    {
        path: '/shop/:id',
        component: MainLayout,
        children: ShopPage,
        breadcrumb : t("breadcrumbs.shop")
    },
    {
        path: '/cart',
        component: MainLayout,
        children: CartPage,
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
        component: MainLayout,
        children: OrdersPage,
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
        component: MainLayout,
        children: ProfilePage,
        breadcrumb : t("breadcrumbs.profile")
    },
    {
        path: "/shop/product/:id",
        component: MainLayout,
        children: ProductPage,
        breadcrumb : t("breadcrumbs.shopProduct")
    },
    {
        path: "/shop/product/:id/reviews",
        component: MainLayout,
        children: ProductReviews,
        breadcrumb : t("breadcrumbs.productReviews")
    },
    {
        path: "/favorites",
        component: MainLayout,
        children: Favorites,
        breadcrumb : t("breadcrumbs.favorites")
    },
    {
        path: "/feedback",
        component: MainLayout,
        children: FeedBackPage,
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
        children: Users,
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
    {
        path: '/admin/productAccounting',
        component: AdminLayout,
        children: ProductAccounting,
        breadcrumb : t("titles.productAccounting")
    },
    {
        path: "/admin/discounts",
        component: AdminLayout,
        children: DiscountsPage,
        breadcrumb : t("breadcrumbs.discounts")
    },
    {
        path: "/admin/feedback/:id",
        component: AdminLayout,
        children: FeedBackInfoPage,
        breadcrumb : t("breadcrumbs.feedback")
    },
    {
        path: "/admin/statistic",
        component: AdminLayout,
        children: StatisticPage,
        breadcrumb : t("breadcrumbs.statistic")
    },
    {
        path: "/admin/static-page-generator",
        component: AdminLayout,
        children: StaticPageGeneratorPage,
        breadcrumb : t("breadcrumbs.staticPageGenerator")
    },
];
