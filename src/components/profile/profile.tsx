import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../configs/axiosconfig/axios';
import { useNavigate } from 'react-router';
import { store } from '../../store';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import './profile.scss';

export default function ProfilePage () {
    const { t } = useTranslation();
    const user = useSelector((store: any) => store.user);
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem("token");
        store.dispatch({ type: "USER", payload: null });
        navigate("/auth/signin");
    };

    useEffect(() => {
        $api.get("/profile")
        .then((res) => {
            store.dispatch({ type: "USER", payload: res.data.user[0] });
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        document.title = t("titles.profilePage");
    });

    return (
        <div className='profile'>
            <div className="profile-header">{ t("titles.profilePage") }</div>
            <div className="profile-content">
                <div className="user-avatar">
                    <img src={ user?.avatar }></img>
                </div>
                <div className="user-login">{ t("text.login") }: { user?.login }</div>
                <div className="user-role">{ t("text.role") }: { user?.role }</div>
                <Button variant="contained" onClick={ logout }>{ t("text.logout") }</Button>
            </div>
        </div>
    );
}