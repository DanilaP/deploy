import { useRef, useState } from 'react';
import { useTranslation } from '../../../../translation/i18n';
import { IUser } from '../../../../interfaces/interfaces';
import './ManipulateUser.scss';
import $api from '../../../../axiosconfig/axios.js';

export default function ManipulateUser (props: {user: IUser | null, cancel: VoidFunction}) {
    const { t } = useTranslation();
    const [newUserData, setNewUserData] = useState<IUser | null>(props.user);
    const selectref = useRef<any>();

    const confirm = () => {
        if (props.user) {
            $api.put("/users", { ...newUserData, role: selectref.current.value })
            .then((res) => {
                console.log(res);
                props.cancel();
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            if (newUserData?.login && newUserData.password) {
                $api.post("/users", { ...newUserData, role: selectref.current.value })
                .then((res) => {
                    console.log(res);
                    props.cancel();
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            props.cancel();
        }
    };

    return (
        <div className='manipulateUser'>
            <div className="data">
                <label>Роль</label>
                <select ref={selectref}>
                    <option value={"Администратор"}>Администратор</option>
                    <option value={"Пользователь"}>Пользователь</option>
                </select>
                <label>Логин</label>
                <input 
                    onChange={(e) => setNewUserData({ ...newUserData, login: e.target.value })} 
                    defaultValue={props.user ? props.user.login : ""}
                />
                <label>Пароль</label>
                <input onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} />
            </div>
            <div className="settings">
                <button onClick={confirm}>{t("text.confirm")}</button>
                <button onClick={props.cancel}>{t("text.close")}</button>
            </div>
        </div>
    );
}