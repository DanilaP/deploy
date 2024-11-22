import { Autocomplete, Button, FormControl, FormLabel, TextField } from "@mui/material";
import "./call-back-form.scss";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ICallBack } from "../../../interfaces/interfaces";

interface ICallBackFormProps {
    handleCloseCreatingNewCallback: () => void,
    handleSaveNewCallback: (callback: ICallFormData) => void
}

export interface ICallFormData {
    firstName: string,
    secondName: string,
    email: string,
    phoneNumber: string,
    description: string,
    typeOfBid: string
}

export default function CallBackForm({
    handleCloseCreatingNewCallback,
    handleSaveNewCallback
}: ICallBackFormProps) {

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<ICallFormData>();

    const { t } = useTranslation();

    const handleCreateNewCallback = (data: ICallFormData) => {
        handleSaveNewCallback(data);
    };

    return (
        <form className="call-back-form" onSubmit={ handleSubmit(handleCreateNewCallback) }>
            <FormControl>
                <FormLabel className="label">{ t("text.yourName") }</FormLabel>
                <TextField
                    placeholder={ t("text.yourName") }
                    { ...register("firstName") }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.yourSecondName") }</FormLabel>
                <TextField
                    placeholder={ t("text.yourSecondName") }
                    { ...register("secondName") }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.email") }</FormLabel>
                <TextField
                    placeholder={ t("text.email") }
                    { ...register("email") }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.typeOfBid") }</FormLabel>
                <Controller
                    name="typeOfBid"
                    control={ control }
                    defaultValue="Отзыв"
                    rules={ { required: t("errors.requiredField") } }
                    render={ ({ field }) => (
                        <Autocomplete
                            { ...field }
                            options={ [
                                "Жалоба", "Отзыв", "Другое"
                            ] }
                            onChange={ (_, value) => field.onChange(value) }
                            renderInput={ (params) => (
                                <TextField
                                    placeholder={ t("text.search") }
                                    { ...params }
                                />
                            ) }
                        />
                    ) }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.phone") }</FormLabel>
                <TextField
                    placeholder={ t("text.phone") }
                    { ...register("phoneNumber") }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.description") }</FormLabel>
                <TextField
                    multiline
                    minRows={ 3 }
                    maxRows={ 3 }
                    placeholder={ t("text.description") }
                    { ...register("description") }
                />
            </FormControl>
            <div className="form-actions">
                <Button type="submit" variant="contained">{ t("text.save") }</Button>
                <Button variant="contained" onClick={ handleCloseCreatingNewCallback }>{ t("text.close") }</Button>
            </div>
        </form>
    );
}