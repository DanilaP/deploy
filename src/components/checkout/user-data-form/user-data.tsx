import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { observer } from 'mobx-react-lite';
import { useStore } from "../../../stores";
import { validatePhone } from "../../../validators-helper.tsx";
import CustomModal from "../../../components-ui/custom-modal/custom-modal.tsx";
import "./user-data.scss";

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

            <CustomModal
                isDisplay={ open }
                title = { t("text.checkout.editRecipient")  }
                typeOfActions='none'
                closeModal={ () => setOpen(false) }
            >

                <form onSubmit={ handleSubmit(onSubmit) }>
                        <Grid container spacing={ 2 } className="form-grid">
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
                                            if (!validatePhone(value)) {
                                                return t("text.checkout.errors.incorrectTel");
                                            }
                                            return true;
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
                        <div className="buttons-wrapper">
                            <Button onClick={ () => setOpen(false) } color="secondary">
                                { t("text.cancel") }
                            </Button>
                            <Button type="submit" color="primary">
                                { t("text.confirm") }
                            </Button>
                        </div>
                </form>
            </CustomModal>
        </div>
    );
};

export default observer(UserData);
