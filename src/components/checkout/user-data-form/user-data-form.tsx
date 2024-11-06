import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import './user-data-form.scss';

interface UserDataFormProps {
    name: string;
    setName: (name: string) => void;
    tel: string;
    setTel: (tel: string) => void;
}

const UserDataForm: React.FC<UserDataFormProps> = ({ name, setName, tel, setTel}) => {
    const { t } = useTranslation();

    return (
        <form className="user-data-wrapper">
            <Grid container spacing={2} >
                <Grid size={{xs: 6}}>
                    <TextField
                        onChange={(e) => setName(e.target.value)}
                        label={t('text.checkout.nameLabel')}
                        variant="outlined"
                        fullWidth
                        value={name}
                        required
                    />
                </Grid>
                <Grid size={{xs: 6}}>
                    <TextField
                        onChange={(e) => setTel(e.target.value)}
                        label={t('text.checkout.telLabel')}
                        variant="outlined"
                        fullWidth
                        value={tel}
                        type="tel"
                        required
                    />
                </Grid>
            </Grid>
        </form>
    );
};

export default UserDataForm;
