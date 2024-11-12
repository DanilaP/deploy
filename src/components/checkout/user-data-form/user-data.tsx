import { useState } from "react";
import Grid from "@mui/material/Grid2";
import {
    TextField,
    TextFieldProps,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import './user-data.scss';
import InputMask from 'react-input-mask';
import { FC } from "react";

interface UserDataDialogFormProps {
    name: string;
    tel: string;
    handleChange: (field: "name" | "payment" | "tel", value: string) => void;
    errors: {
        name?: string;
        tel?: string;
    };
    handleConfirmUserData: () => boolean;
}

const ruPhoneMask = "+7 (999) 999-99-99";

const UserData: FC<UserDataDialogFormProps> = ({
  name,
  tel,
  handleChange,
  errors,
  handleConfirmUserData,
}) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <div className="user-data-wrapper">
            <Button onClick={ () => setOpen(true) } color="primary" className="user-data-btn">
                { (!name && !tel) ? 'Добавить данные' : t('text.checkout.editRecipient') }
            </Button>

            <Dialog maxWidth="sm" fullWidth open={ open } onClose={ () => setOpen(false) }>
                <DialogContent>
                    <Typography>
                        { t('text.checkout.editRecipient') }
                    </Typography>
                </DialogContent>
                <DialogContent>
                    <Grid container spacing={ 2 }>
                        <Grid size={ { xs: 6 } }>
                            <TextField
                                onChange={ (event) => handleChange('name', event.target.value) }
                                label={ t('text.checkout.nameLabel') }
                                variant="outlined"
                                fullWidth
                                value={ name }
                                required
                                error={ !!errors.name }
                                helperText={ errors.name }
                            />
                        </Grid>
                        <Grid size={ { xs: 6 } }>
                            <InputMask
                                mask={ ruPhoneMask }
                                value={ tel }
                                onChange={ (event) => handleChange('tel', event.target.value) }
                            >
                                { (inputProps: TextFieldProps) => {
                                    return (
                                        <TextField
                                            { ...inputProps }
                                            label={ t('text.checkout.telLabel') }
                                            variant="outlined"
                                            fullWidth
                                            required
                                            error={ !!errors.tel }
                                            helperText={ errors.tel || '' }
                                        />
                                    );
                                } }
                            </InputMask>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={ () => setOpen(false) }
                        color="secondary"
                    >
                        { t('text.cancel') }
                    </Button>
                    <Button
                        onClick={ () => {
                            const isValid = handleConfirmUserData();
                            if (isValid) {
                                setOpen(false);
                            }
                        } }
                        color="primary"
                    >
                        { t('text.confirm') }
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserData;
