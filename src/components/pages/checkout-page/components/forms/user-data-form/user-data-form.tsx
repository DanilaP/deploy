import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../../../stores";
import { TextField, Button, FormControl, FormHelperText } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { validatePhone } from "../../../../../../helpers/validators/validators-helper.ts";
import "./user-data-form.scss";


const UserDataForm: FC <{ setOpen: (b: boolean) => void}> = ({ setOpen }) => {
    const { t } = useTranslation();
    const { userStore } = useStore();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: userStore?.user?.name || "",
            tel: userStore?.user?.tel || "",
        },
    });

    const onSubmit = (data: { name: string; tel: string }) => {
        userStore.updateUserData({ name: data.name, tel: data.tel });
        setOpen(false);
    };

    return (
        <form className="user-data-wrapper" onSubmit={ handleSubmit(onSubmit) }>
            <Grid container spacing={ 2 } className="form-grid">
                <Grid size={ { xs: 6 } }>
                    <FormControl fullWidth error={ !!errors.name }>
                        <Controller
                            name="name"
                            control={ control }
                            rules={ {
                                required: t("text.checkout.errors.emptyName"),
                            } }
                            render={ ({ field }) => (
                                <TextField
                                    { ...field }
                                    label={ t("text.checkout.nameLabel") }
                                    variant="outlined"
                                    fullWidth
                                />
                            ) }
                        />
                        <FormHelperText>{ errors.name?.message }</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid size={ { xs: 6 } }>
                    <FormControl fullWidth error={ !!errors.tel }>
                        <Controller
                            name="tel"
                            control={ control }
                            rules={ {
                                required: t("text.checkout.errors.emptyTel"),
                                validate: (value) =>
                                    validatePhone(value) || t("text.checkout.errors.incorrectTel"),
                            } }
                            render={ ({ field }) => (
                                <InputMask
                                    mask={ "+7 (999) 999-99-99" }
                                    value={ field.value || "" }
                                    onChange={ field.onChange }
                                    onBlur={ field.onBlur }
                                >
                                    { (inputProps) => (
                                        <TextField
                                            { ...inputProps }
                                            label={ t("text.checkout.telLabel") }
                                            variant="outlined"
                                            fullWidth
                                        />
                                    ) }
                                </InputMask>
                            ) }
                        />
                        <FormHelperText>{ errors.tel?.message }</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>

            <div className="buttons-wrapper">
                <Button
                    onClick={ () => {
                        setOpen(false);
                        reset();
                    } }
                    color="secondary"
                >
                    { t("text.cancel") }
                </Button>
                <Button type="submit" color="primary">
                    { t("text.confirm") }
                </Button>
            </div>
        </form>
    );
};

export default observer(UserDataForm);
