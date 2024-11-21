import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import "./call-back-form.scss";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ICallBackFormProps {
    
}

interface ICallFormData {
    firstName: string,
    secondName: string
}

export default function CallBackForm(props: ICallBackFormProps) {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ICallFormData>();

    const { t } = useTranslation();

    const handleCreateNewCallback = (data: ICallFormData) => {
        console.log(data);
    };

    return (
        <form className="call-back-form" onSubmit={ handleSubmit(handleCreateNewCallback) }>
            <FormControl>
                <FormLabel>{ t("text.yourName") }</FormLabel>
                <TextField
                    placeholder={ t("text.yourName") }
                    { ...register("firstName") }
                />
            </FormControl>
            <FormControl>
                <FormLabel>{ t("text.yourSecondName") }</FormLabel>
                <TextField
                    placeholder={ t("text.yourSecondName") }
                    { ...register("secondName") }
                />
            </FormControl>
            <div className="form-actions">
                <Button type="submit" variant="contained">{ t("text.save") }</Button>
                <Button variant="contained">{ t("text.close") }</Button>
            </div>
        </form>
    );
}