import { useEffect, useState } from 'react';
import { useTranslation } from '../../../../translation/i18n.js';
import { IRole, IUser } from '../../../../interfaces/interfaces.js';
import './manipulate-user.scss';
import $api from '../../../../configs/axiosconfig/axios.js';
import { Autocomplete, Button, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { validateRequiredField } from '../../../../helpers/validators-helper.js';

interface formData {
    role: string,
    login: string,
    password: string
}

export default function ManipulateUser (props: {user: IUser | null, cancel: VoidFunction, handleUpdateUsers: Void}) {
    const { t } = useTranslation();
    const { register, handleSubmit, control, formState: { errors } } = useForm<formData>();
    const [roles, setRoles] = useState<IRole[]>([]);

    const onSubmit: SubmitHandler<formData> = (data) => {
        confirm(data);
    };

    const confirm = (newUserData: formData) => {
        if (props.user) {
            const newUser = {
                ...props.user,
                login: newUserData.login,
                password: newUserData.password,
                role: newUserData.role,
            };
            $api.put("/users", newUser)
            .then((res) => {
                props.handleUpdateUsers(res.data.user);
                props.cancel();
            })
            .catch((error) => {
                console.error(t("methods.modifyUserMethod"), error);
            });
        }
        else {
            $api.post("/users", { ...newUserData })
            .then((res) => {
                props.handleUpdateUsers(res.data.users);
                props.cancel();
            })
            .catch((error) => {
                console.error(t("methods.createUserMethod"), error);
            });
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
                <form onSubmit={ handleSubmit(onSubmit) } className="manipulate-user-form">
                    <label>{ t("text.role") }</label>
                    <Controller
                        name="role" 
                        defaultValue={ props.user?.role }
                        control={ control }
                        rules={ { required: true } }
                        render={ ({ field }) => {
                            return (
                                <Autocomplete
                                    { ...field }
                                    options={ roles.map(role => role.name) }
                                    getOptionLabel={ (option) => option }
                                    onChange={ (_, value) => field.onChange(value) }
                                    value={ field.value }
                                    renderInput={ (params) => 
                                        <TextField 
                                            onChange={ (value) => field.onChange(value) }
                                            helperText={ errors.role ? t("text.requiredField") : "" } 
                                            error={ Boolean(errors.role) } 
                                            { ...params }  
                                    /> 
                                }
                            />
                            );
                        } }
                    >
                    </Controller>
                    <label>{ t("text.login") }</label>
                    <TextField 
                        error = { Boolean(errors.login) }
                        helperText = { String(errors.login?.message || "") }
                        {
                            ...register("login", {
                                validate: (value: string) => validateRequiredField(value) ? true : t("text.requiredField")
                            })
                        }
                        placeholder='example@gmail.com'
                        defaultValue={ props.user ? props.user.login : "" }
                    />
                    <label>{ t("text.password") }</label>
                    <TextField 
                        error = { Boolean(errors.password) }
                        helperText = { String(errors.password?.message || "") }
                        {
                            ...register("password", {
                                validate: (value: string) => validateRequiredField(value) ? true : t("text.requiredField")
                            })
                        }
                        placeholder='examplepassword'
                    />
                    <div className="settings">
                        <Button type='submit' variant="contained">{ t("text.confirm") }</Button>
                        <Button onClick={ props.cancel } variant="contained">{ t("text.close") }</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
