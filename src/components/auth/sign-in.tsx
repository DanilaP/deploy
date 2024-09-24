import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import { validator } from '../../helpers/auth-helpers';
import { IUser } from '../../interfaces/interfaces';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { store } from '../../store';


export default function SignIn () {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<IUser>();
    const navigate = useNavigate();

    const signIn = async () => {
        if (validator.validateForm(userData)) {
            axios.post("http://localhost:5000/auth/signin", userData)
            .then((res) => {
                sessionStorage.setItem("token", res.data.token);
                store.dispatch({ type: "USER", payload: res.data.user });
                navigate("/profile");
            })
            .catch((error) => {
                console.error(t("methods.signInMethod"), error);
            });
        }
    };

    useEffect(() => {
        document.title = t("titles.signIn");
    });
    return (
        <div className='signIn__main'>
            <FormControl>
                <FormLabel>{ t("titles.signIn") }</FormLabel>
                <TextField onChange={(e) => setUserData({ ...userData, login: e.target.value })} 
                        placeholder='example@gmail.com'
                />
                <TextField onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                        type='password' 
                        placeholder='password123'
                />
                <Button onClick={signIn}>{ t("titles.signInButton") }</Button>
            </FormControl>
        </div>
    );
}