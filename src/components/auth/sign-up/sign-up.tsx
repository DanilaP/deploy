import { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Link, TextField } from '@mui/material';
import { IUser } from '../../../interfaces/interfaces';
import { validator } from '../../../helpers/auth-helpers';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../stores';

export default function SignUp () {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<IUser>();
    const navigate = useNavigate();

    const { userStore } = useStore();

    const signUp = async () => {
        if (validator.validateForm(userData)) {
            axios.post("http://localhost:5000/auth/signup", userData)
            .then((res) => {
                sessionStorage.setItem("token", res.data.token);
                userStore.setUser(res.data.user);
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
        <div className='sign-up-main'>
            <FormControl>
                <FormLabel><h1>{ t("titles.signUp") }</h1></FormLabel>
                <FormLabel>{ t("text.login") }</FormLabel>
                <TextField onChange={ (e) => setUserData({ ...userData, login: e.target.value }) }
                        placeholder='example@gmail.com'
                />
                <FormLabel>{ t("text.password") }</FormLabel>
                <TextField onChange={ (e) => setUserData({ ...userData, password: e.target.value }) }
                        type='password'
                        placeholder='password123'
                />
                <Button variant='contained' onClick={ signUp }>{ t("titles.signUpButton") }</Button>
            </FormControl>
            <Link onClick={ () => navigate("/auth/signIn") } className="footer-links">{ t("text.alreadyHaveAcc") }</Link>
        </div>
    );
}
