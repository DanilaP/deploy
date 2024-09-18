import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import { validateForm } from '../../helpers/authHelpers';
import { IUser } from '../../interfaces/interfaces';
import axios from 'axios';


export default function SignIn () {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<IUser>();

    const signIn = async () => {
        if (validateForm(userData)) {
            axios.get(`http://localhost:3000/users?login_eq=${userData?.login}&password_eq=${userData?.password}`)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        document.title = t("titles.signIn");
    });
    return (
        <div className='signIn__main'>
            <FormControl>
                <FormLabel>{t("titles.signIn")}</FormLabel>
                <TextField onChange={(e) => setUserData({ ...userData, login: e.target.value })} 
                        placeholder='Логин'
                />
                <TextField onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                        type='password' 
                        placeholder='Пароль'
                />
                <Button onClick={signIn}>Войти</Button>
            </FormControl>
        </div>
    );
}