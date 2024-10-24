import { useEffect, useState } from 'react';
import { useTranslation } from '../../../../translation/i18n.js';
import { IRole, IUser } from '../../../../interfaces/interfaces.js';
import './manipulate-user.scss';
import $api from '../../../../configs/axiosconfig/axios.js';
import { Button, MenuItem, Select, TextField } from '@mui/material';

export default function ManipulateUser (props: {user: IUser | null, cancel: VoidFunction, handleUpdateUsers: Void}) {
    const { t } = useTranslation();
    const [newUserData, setNewUserData] = useState<IUser | null>(props.user);
    const [roles, setRoles] = useState<IRole[]>([]);

    const confirm = () => {
        if (props.user) {
            let newUser: IUser = {
                id: newUserData?.id,
                login: newUserData?.login,
                role: newUserData?.role,
                avatar: newUserData?.avatar
            };
            if (newUserData?.password !== props.user.password) {
                newUser.password = newUserData?.password;
            }
            $api.put("/users", newUser)
            .then((res) => {
                props.handleUpdateUsers(res.data.user);
                props.cancel();
            })
            .catch((error) => {
                console.error(t("methods.modifyUserMethod"), error);
            });
        } else {
            if (newUserData?.login && newUserData.password) {
                $api.post("/users", { ...newUserData })
                .then((res) => {
                    props.handleUpdateUsers(res.data.users);
                    props.cancel();
                })
                .catch((error) => {
                    console.error(t("methods.createUserMethod"), error);
                });
            }
            props.cancel();
        }
    };

    useEffect(() => {
        $api.get("/roles")
        .then((res) => {
            setRoles(res.data.roles);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className='manipulate-user'>
            <div className="data">
                <label>{ t("text.role") }</label>
                <Select
                    defaultValue={ props.user?.role }
                    onChange={ (e) => setNewUserData({ ...newUserData, role: e.target.value }) }
                >
                    { /*Todo: send id instead of name */ }
                    {
                        roles.map((role: IRole) => {
                            return <MenuItem value={ role.name }>{ role.name }</MenuItem>;
                        })
                    }
                </Select>
                <label>{ t("text.login") }</label>
                <TextField 
                    onChange={ (e) => setNewUserData({ ...newUserData, login: e.target.value }) } 
                    defaultValue={ props.user ? props.user.login : "" }
                />
                <label>{ t("text.password") }</label>
                <TextField onChange={ (e) => setNewUserData({ ...newUserData, password: e.target.value }) } />
                
            </div>
            <div className="settings">
                <Button onClick={ confirm } variant="contained">{ t("text.confirm") }</Button>
                <Button onClick={ props.cancel } variant="contained">{ t("text.close") }</Button>
            </div>
        </div>
    );
}