import Grid from "@mui/material/Grid2";
import { FormHelperText, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import './user-data-form.scss';

interface UserDataFormProps {
    name: string;
    handleTelChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    tel: string;
    handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    nameError: string;
    telError: string;
}

const UserDataForm: React.FC<UserDataFormProps> = ({
   name,
   tel,
   nameError,
   telError,
   handleNameChange,
   handleTelChange
}) => {
    const { t } = useTranslation();

    return (
            <Grid className="user-data-wrapper" container spacing={2} >
                <Grid size={{xs: 6}}>
                    <TextField
                        onChange={handleNameChange}
                        label={t('text.checkout.nameLabel')}
                        variant="outlined"
                        fullWidth
                        value={name}
                        required
                        error={!!nameError}
                    />
                    {nameError && <FormHelperText error>{nameError}</FormHelperText>}
                </Grid>
                <Grid size={{xs: 6}}>
                    <TextField
                        onChange={handleTelChange}
                        label={t('text.checkout.telLabel')}
                        variant="outlined"
                        fullWidth
                        value={tel}
                        type="tel"
                        required
                        error={!!telError}
                    />
                    {telError && <FormHelperText error>{telError}</FormHelperText>}
                </Grid>
            </Grid>
    );
};

export default UserDataForm;
