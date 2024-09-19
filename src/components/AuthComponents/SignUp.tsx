import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import { IUser } from '../../interfaces/interfaces';
import { validator } from '../../helpers/authHelpers';
import axios from 'axios';


export default function SignUp () {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<IUser>();

    const signUp = async () => {
        if (validator.validateForm(userData)) {
            axios.post("http://localhost:5000/auth/signup", userData)
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
                        placeholder='example@gmail.com'
                />
                <TextField onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                        type='password' 
                        placeholder='password123'
                />
                <Button onClick={signUp}>{t("titles.signUpButton")}</Button>
            </FormControl>
        </div>
    );
}