import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../../../configs/axiosconfig/axios.js';
import { IUser } from '../../../../interfaces/interfaces.js';
import './users-list.scss';
import CustomModal from '../../../../components-ui/CustomModal/custom-modal.js';
import ManipulateUser from '../manipulate-user/manipulate-user.js';
import { Button } from '@mui/material';

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
        })
        .catch((error) => {
            console.error(t("methods.deleteUserMethod"), error);
        });
    };

    const startManipulating = (user: IUser | null) => {
        setChoosenUser(user);
        setModalState({ ...modalState, manipulateModal: true });
    };
    
    const updateUsersList = (newUsers: IUser[]) => {
        setUsers(newUsers);
    };

    useEffect(() => {
        $api.get("/users")
        .then((res) => {
            setUsers(res.data.users);
        })
        .catch((error) => {
            console.error(t("methods.getUsersMethod"), error);
        });
    }, []);

    useEffect(() => {
        document.title = t("titles.usersPage");
    });

    return (
        <div className='usersList'>
            <Button className='createButton' onClick={() => startManipulating(null)} variant="contained">{ t("text.createUser") }</Button>
            {
                users?.map((user: IUser) => {
                    return (
                        <div key={ user.id } className='user'>
                            <div className="user__info">
                                <div className="user__id">{ t("text.user") }: { user.id }</div>
                                <div className="user__login">{ t("text.login") }: { user.login }</div>
                                <div className="user__role">{ t("text.role") }: { user.role }</div>
                            </div>
                            <div className="user__settings">
                                <Button onClick={ () => startManipulating(user) } variant="contained">{ t("text.edit") }</Button>
                                <Button onClick={ () => startDeleteUser(user) } variant="contained">{ t("text.delete") }</Button>
                            </div>
                        </div>
                    );
                })
            }
            <CustomModal 
                isDisplay={modalState.deleteModal}
                title = { t("text.deletingUser") }
                typeOfActions='default'
                actionConfirmed={aproveDeleteUser}
                closeModal={() => setModalState({ ...modalState, deleteModal: false })}
            >
                <div>{ t("text.deletingUserConfirmation") }</div>
            </CustomModal>
            <CustomModal 
                isDisplay={modalState.manipulateModal}
                title = {`${ t("text.manipulateUser") } ${choosenUser ? choosenUser?.id : t("text.creating") }`}
                typeOfActions='none'
                actionConfirmed={aproveDeleteUser}
                closeModal={() => setModalState({ ...modalState, manipulateModal: false })}
            >
                <ManipulateUser 
                    handleUpdateUsers = {updateUsersList}
                    cancel = {() => setModalState({ ...modalState, manipulateModal: false })} 
                    user={choosenUser}>
                </ManipulateUser>
            </CustomModal>
        </div>
    );
}