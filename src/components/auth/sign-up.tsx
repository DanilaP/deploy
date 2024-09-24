import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import { IUser } from '../../interfaces/interfaces';
import { validator } from '../../helpers/auth-helpers';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { store } from '../../store';


export default function SignUp () {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<IUser>();
    const navigate = useNavigate();

    const signUp = async () => {
        if (validator.validateForm(userData)) {
            axios.post("http://localhost:5000/auth/signup", userData)
            .then((res) => {
                sessionStorage.setItem("token", res.data.token);
                store.dispatch({ type: "USER", payload: res.data.user });
                navigate("/profile");
            })
            .catch((error) => {
                console.error(t("methods.signUpMethod"), error);
            });
        }
    };

    useEffect(() => {
        document.title = t("titles.signUp");
    });

    return (
        <div className='signUp__main'>
            <FormControl>
                <FormLabel>{ t("titles.signUp") }</FormLabel>
                <TextField onChange={(e) => setUserData({ ...userData, login: e.target.value })} 
                        placeholder='example@gmail.com'
                />
                <TextField onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                        type='password' 
                        placeholder='password123'
                />
                <Button onClick={signUp}>{ t("titles.signUpButton") }</Button>
            </FormControl>
        </div>
    );
}