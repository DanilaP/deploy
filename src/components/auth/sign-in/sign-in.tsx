import { useEffect } from 'react';
import { Button, FormLabel, Link, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../stores';
import { formData } from '../auth-interfaces/auth-interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateEmail, validateRequiredEmail, validateRequiredField } from '../../../helpers/validators-helper';


export default function SignIn () {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm<formData>();
    const navigate = useNavigate();

    const { userStore } = useStore();

    const onSubmit: SubmitHandler<formData> = (data) => {
        signUp(data);
    };

    const signUp = async (userData: formData) => {
        axios.post("http://localhost:5000/auth/signin", userData)
        .then((res) => {
            sessionStorage.setItem("token", res.data.token);
            userStore.setUser(res.data.user);
            navigate("/profile");
        })
        .catch((error) => {
            console.error(t("methods.signInMethod"), error);
        });
    };

    useEffect(() => {
        document.title = t("titles.signIn");
    }, []);

    return (
        <div className='sign-in-main'>
            <form onSubmit={ handleSubmit(onSubmit) } className='auth-form-main'>
                <FormLabel><h1>{ t("titles.signIn") }</h1></FormLabel>
                <FormLabel>{ t("text.login") }</FormLabel>
                <TextField 
                    error = { Boolean(errors.login) }
                    helperText = { String(errors.login?.message || "") }
                    {
                        ...register("login", {
                            validate: (
                                (value: string) => validateRequiredEmail(value)
                            )
                        })
                    }
                    placeholder='example@gmail.com'
                />
                <FormLabel>{ t("text.password") }</FormLabel>
                <TextField 
                    error = { Boolean(errors.password) }
                    helperText = { String(errors.password?.message || "") }
                    {
                        ...register("password", {
                            validate: (value: string) => validateRequiredField(value) ? true : t("text.requiredField")
                        })
                    }
                    autoComplete="on"
                    type='password'
                    placeholder='password123'
                />
                <Button type='submit' variant='contained'>{ t("titles.signInButton") }</Button>
            </form>
            <Link onClick={ () => navigate("/auth/signUp") } className="footer-links">{ t("text.stillNotReg") }</Link>
        </div>
    );
}
