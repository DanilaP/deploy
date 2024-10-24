import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../configs/axiosconfig/axios';
import { useNavigate } from 'react-router';
import { store } from '../../store';
import { useSelector } from 'react-redux';
import { Button, Input } from '@mui/material';
import './profile.scss';
import InputFile from '../../components-ui/custom-file-nput/file-input';

export default function ProfilePage () {
    const { t } = useTranslation();
    const user = useSelector((store: any) => store.user);
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem("token");
        store.dispatch({ type: "USER", payload: null });
        store.dispatch({ type: "USERPERMISSIONS", payload: {} });
        navigate("/auth/signin");
    };

    useEffect(() => {
        $api.get("/profile")
        .then((res) => {
            store.dispatch({ type: "USER", payload: res.data.user[0] });
            store.dispatch({ type: "USERPERMISSIONS", payload: res.data.permissions });
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
                    <div className="name">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi, sapiente!</div>
                    <div className="surname">Lorem ipsum dolor sit amet.</div>
                    <div className="phone-number">Lorem ipsum dolor sit amet consectetur adipisicing.</div>
                    <div className="town">Lorem, ipsum dolor.</div>
                </div>
            </div>
        </div>
    );
}