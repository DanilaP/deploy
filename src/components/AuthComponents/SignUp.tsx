import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import { IUser } from '../../interfaces/interfaces';
import { validateForm } from '../../helpers/authHelpers';
import axios from 'axios';


export default function SignUp () {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<IUser>();

    const signUp = async () => {
        if (validateForm(userData)) {
            axios.post("http://localhost:3000/users", { ...userData, isAdmin: false })
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        document.title = t("titles.signUp");
    });

    return (
        <div className='signUp__main'>
            <FormControl>
                <FormLabel>{t("titles.signUp")}</FormLabel>
                <TextField onChange={(e) => setUserData({ ...userData, login: e.target.value })} 
                        placeholder='Логин'
                />
                <TextField onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                        type='password' 
                        placeholder='Пароль'
                />
                <Button onClick={signUp}>Зарегестрироваться</Button>
            </FormControl>
        </div>
    );
}