import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../../../axiosconfig/axios.js';
import { IUser } from '../../../../interfaces/interfaces.js';
import './UsersList.scss';
import CustomModal from '../../../../components-ui/CustomModal/CustomModal.js';
import ManipulateUser from '../ManipulateUser/ManipulateUser.js';

export default function UsersList () {
    const { t } = useTranslation();
    const [users, setUsers] = useState<IUser[]>();
    const [modalState, setModalState] = useState({ manipulateModal: false, deleteModal: false });
    const [choosenUser, setChoosenUser] = useState<IUser | null>(null);

    const startDeleteUser = (user: IUser) => {
        setChoosenUser(user);
        setModalState({ ...modalState, deleteModal: true });
    };

    const aproveDeleteUser = () => {
        $api.delete(`/users?id=${choosenUser?.id}`)
        .then((res) => {
            setUsers(res.data.users);
            setModalState({ ...modalState, deleteModal: false });
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const startManipulating = (user: IUser | null) => {
        setChoosenUser(user);
        setModalState({ ...modalState, manipulateModal: true });
    };
    
    useEffect(() => {
        $api.get("/users")
        .then((res) => {
            setUsers(res.data.users);
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        document.title = t("titles.usersPage");
    });

    return (
        <div className='usersList'>
            <button onClick={() => startManipulating(null)} className='createUser__button'>{t("text.createUser")}</button>
            {
                users?.map((user: IUser) => {
                    return (
                        <div key={user.id} className='user'>
                            <div className="user__info">
                                <div className="user__id">{t("text.user")}:{user.id}</div>
                                <div className="user__login">{t("text.login")}:{user.login}</div>
                                <div className="user__role">{t("text.role")}:{user.role}</div>
                            </div>
                            <div className="user__settings">
                                <button onClick={() => startManipulating(user)}>{t("text.edit")}</button>
                                <button onClick={() => startDeleteUser(user)}>{t("text.delete")}</button>
                            </div>
                        </div>
                    );
                })
            }
            <CustomModal 
                isDisplay={modalState.deleteModal}
                title = "Удаление пользователя"
                typeOfActions='default'
                actionConfirmed={aproveDeleteUser}
                closeModal={() => setModalState({ ...modalState, deleteModal: false })}
            >
                <div>Хотите удалить пользователя?</div>
            </CustomModal>
            <CustomModal 
                isDisplay={modalState.manipulateModal}
                title = {`Управление пользователем ${choosenUser ? choosenUser?.id : "(создание)"}`}
                typeOfActions='none'
                actionConfirmed={aproveDeleteUser}
                closeModal={() => setModalState({ ...modalState, manipulateModal: false })}
            >
                <ManipulateUser 
                    cancel = {() => setModalState({ ...modalState, manipulateModal: false })} 
                    user={choosenUser}>
                </ManipulateUser>
            </CustomModal>
        </div>
    );
}