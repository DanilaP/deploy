import { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Link, TextField } from '@mui/material';
import { validator } from '../../../helpers/auth-helpers';
import { IUser } from '../../../interfaces/interfaces';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { store } from '../../../store';
import { useTranslation } from 'react-i18next';


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
        <div className='sign-in-main'>
            <FormControl>
                <FormLabel><h1>{ t("titles.signIn") }</h1></FormLabel>
                <FormLabel>{ t("text.login") }</FormLabel>
                <TextField onChange={ (e) => setUserData({ ...userData, login: e.target.value }) } 
                        placeholder='example@gmail.com'
                />
                <FormLabel>{ t("text.password") }</FormLabel>
                <TextField onChange={ (e) => setUserData({ ...userData, password: e.target.value }) } 
                        type='password' 
                        placeholder='password123'
                />
                <Button variant='contained' onClick={ signIn }>{ t("titles.signInButton") }</Button>
            </FormControl>
            <Link onClick={ () => navigate("/auth/signUp") } className="footer-links">{ t("text.stillNotReg") }</Link>
        </div>
    );
}