import { useState } from "react";
import Grid from "@mui/material/Grid2";
import {
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import "./user-data.scss";
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../stores";
import { validateTel } from "../../../validationUtils.ts";

const ruPhoneMask = "+7 (999) 999-99-99";

const UserData = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { userStore } = useStore();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: userStore?.user?.name || '',
            tel: userStore?.user?.tel || '',
        },
    });

    const onSubmit = (data: { name: string; tel: string }) => {
            userStore.updateUserData({ name: data.name, tel: data.tel });
            setOpen(false);
    };

    return (
        <div className="user-data-wrapper">
            <Button onClick={ () => setOpen(true) } color="primary" className="user-data-btn">
                { t("text.checkout.editRecipient") }
            </Button>

            <Dialog maxWidth="sm" fullWidth open={ open } onClose={ () => setOpen(false) }>
                <form onSubmit={ handleSubmit(onSubmit) }>
                    <DialogContent>
                        <Typography>
                            { t("text.checkout.editRecipient") }
                        </Typography>
                    </DialogContent>
                    <DialogContent>
                        <Grid container spacing={ 2 }>
                            <Grid size={ { xs: 6 } }>
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
                                            required
                                            error={ !!errors.name }
                                            helperText={ errors.name?.message }
                                        />
                                    ) }
                                />
                            </Grid>
                            <Grid size={ { xs: 6 } }>
                                <Controller
                                    name="tel"
                                    control={ control }
                                    rules={ {
                                        required: t("text.checkout.errors.emptyTel"),
                                        validate: (value) => {
                                            const { isValid, errors } = validateTel(value, t);
                                            return isValid || errors.tel;
                                        },
                                    } }
                                    render={ ({ field }) => (
                                        <InputMask
                                            mask={ ruPhoneMask }
                                            value={ field.value }
                                            onChange={ field.onChange }
                                        >
                                            { (inputProps) => (
                                                <TextField
                                                    { ...inputProps }
                                                    label={ t("text.checkout.telLabel") }
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    error={ !!errors.tel }
                                                    helperText={ errors.tel?.message }
                                                />
                                            ) }
                                        </InputMask>
                                    ) }
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ () => setOpen(false) } color="secondary">
                            { t("text.cancel") }
                        </Button>
                        <Button type="submit" color="primary">
                            { t("text.confirm") }
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default observer(UserData);
