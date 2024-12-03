import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../configs/axiosconfig/axios';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import './profile.scss';
import InputFile from '../../components-ui/custom-file-nput/file-input';
import { useStore } from '../../stores';
import cartApi from "../../api/cart.ts";

export default function ProfilePage () {
    const { t } = useTranslation();

    const { userStore, cartStore } = useStore();
    const user = userStore.user;

    const navigate = useNavigate();


    const logout = () => {
        sessionStorage.removeItem("token");
        userStore.setUser(null);
        userStore.setPermissions([]);
        navigate("/auth/signin");
    };

    useEffect(() => {
        $api.get("/profile")
        .then((res) => {
            userStore.setUser(res.data.user[0]);
            userStore.setPermissions(res.data.permissions);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [userStore]);

    useEffect(() => {
        const apiCart = cartApi();
        apiCart.getUserCart()
            .then((res) => {
                cartStore.setCart(res);
            })
            .catch((error) => {
                console.error('Ошибка загрузки данных корзины', error);
            });
    }, []);

    useEffect(() => {
        document.title = t("titles.profilePage");
    });

    return (
        <div className='profile'>
            <div className="profile-content">
                <div className="profile-content-main">
                    <div className="user-avatar">
                        <img src={ user?.avatar }></img>
                        <div className="user-login">{ user?.login }</div>
                        <div className="user-role">{ user?.role }</div>
                        <InputFile />
                    </div>
                    <div className="user-settings">
                        <Button variant="contained">{ t("text.myOrders") }</Button>
                        <Button variant="contained" onClick={ logout }>{ t("text.logout") }</Button>
                        <Button variant="contained">{ t("text.changePassword") }</Button>
                    </div>
                </div>
                <div className="profile-content-info">
                    <div className="item name">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi, sapiente!</div>
                    <div className="item surname">Lorem ipsum dolor sit amet.</div>
                    <div className="item phone-number">Lorem ipsum dolor sit amet consectetur adipisicing.</div>
                    <div className="item town">Lorem, ipsum dolor.</div>
                </div>
            </div>
        </div>
    );
}
