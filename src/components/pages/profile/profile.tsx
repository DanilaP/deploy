import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import './profile.scss';
import InputFile from '../../components-ui/custom-file-nput/file-input.tsx';
import { useStore } from '../../../stores/index.ts';
import CustomModal from '../../components-ui/custom-modal/custom-modal.tsx';
import { getUser } from '../../../models/user/user-api.tsx';

export default function ProfilePage () {
    const { t } = useTranslation();

    const [linkSended, setLinkSended] = useState<boolean>(false);
    const { userStore } = useStore();
    const user = userStore.user;

    const navigate = useNavigate();


    const logout = () => {
        sessionStorage.removeItem("token");
        userStore.setUser(null);
        userStore.setPermissions([]);
        navigate("/auth/signin");
    };

    useEffect(() => {
        getUser()
        .then((res) => {
            userStore.setUser(res.data.user[0]);
            userStore.setPermissions(res.data.permissions);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [userStore]);

    useEffect(() => {
        document.title = t("titles.profilePage");
    }, []);

    return (
        <div className='profile'>
            <div className="profile-content">
                <div className="profile-content-main">
                    <div className="user-avatar">
                        <img src={ user?.avatar }></img>
                        <div className="user-login">{ user?.login }</div>
                        <div className="user-role">{ user?.role }</div>
                        <div className="user-status">
                            {  (!user?.isVerified) && (
                                    <>
                                        <p className='confirmation'>{ t("text.confirmAccount") }</p>
                                        <p onClick={ () => setLinkSended(true) } className='send-link-text'>{ t("text.sendLink") }</p>
                                    </>
                                )
                            }
                        </div>
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
            <CustomModal
                isDisplay={ linkSended }
                title = { t("text.sendingLink") }
                typeOfActions='none'
                actionConfirmed={ () => setLinkSended(false) }
                closeModal={ () => setLinkSended(false) }
            >
                <div>{ t("text.sendLinkSuccessfully") }</div>
            </CustomModal>
        </div>
    );
}
