import { useEffect } from 'react';
import { Button, FormLabel, Link, TextField } from '@mui/material';
import { validator } from '../../../helpers/auth-helpers';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../stores';
import { SubmitHandler, useForm } from 'react-hook-form';
import { validateRequiredField } from '../../../helpers/validators-helper';
import { formData } from '../auth-interfaces/auth-interfaces';

export default function SignUp () {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm<formData>();
    const navigate = useNavigate();

    const { userStore } = useStore();

    const onSubmit: SubmitHandler<formData> = (data) => {
        signUp(data);
    };

    const signUp = async (userData: formData) => {
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
    }, []);

    return (
        <div className='sign-up-main'>
            <form className='auth-form-main' onSubmit={ handleSubmit(onSubmit) }>
                <FormLabel><h1>{ t("titles.signUp") }</h1></FormLabel>
                <FormLabel>{ t("text.login") }</FormLabel>
                <TextField 
                    error = { Boolean(errors.login) }
                    helperText = { String(errors.login?.message || "") }
                    {
                        ...register("login", {
                            validate: (value: string) => validateRequiredField(value) ? true : t("text.requiredField")
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
                <Button type='submit' variant='contained'>{ t("titles.signUpButton") }</Button>
            </form>
            <Link onClick={ () => navigate("/auth/signIn") } className="footer-links">{ t("text.alreadyHaveAcc") }</Link>
        </div>
    );
}
