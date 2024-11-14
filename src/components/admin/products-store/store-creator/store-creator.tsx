import { Autocomplete, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import './store-creator.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import { OPTIONS } from './constants/constants';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { validateRequiredField } from "../../../../helpers/validators-helper";

interface formData {
    storeName: string,
    storeAddress: string
}

export default function StoreCreator (props: { 
    close: () => void,
    addStore: (storeName: string, storeAddress: string) => void
}) {

    const [addresses, setAddresses] = useState([]);
    const { register, handleSubmit, watch, control, formState: { errors } } = useForm<formData>();
    const { t } = useTranslation();

    const onSubmit: SubmitHandler<formData> = (data) => {
        props.addStore(data.storeName, data.storeAddress);
    };

    const currentFormValues = watch();

    useEffect(() => {
        if (currentFormValues.storeAddress?.length >= import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH) {
            axios.post("http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", 
                JSON.stringify({ query: currentFormValues.storeAddress }), 
                OPTIONS
            ).then((res) => {
                setAddresses(res.data.suggestions.map(el => el.value));
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }, [currentFormValues]);
    
    return (
        <div className="store-creator">
            <form onSubmit={ handleSubmit(onSubmit) } className="store-creator-form">
                <TextField 
                    error = { Boolean(errors.storeName) }
                    helperText = { String(errors.storeName?.message || "") }
                    { 
                        ...register("storeName", { 
                            validate: (value) => validateRequiredField(value) ? true : t("text.requiredField")
                        }) 
                    }
                    label={ t("text.storeName") } 
                />
                <Controller
                    name="storeAddress" 
                    defaultValue=""
                    control={ control }
                    rules={ { required: true } }
                    render={ ({ field }) => {
                        return (
                            <Autocomplete
                                { ...field }
                                options={ addresses }
                                getOptionLabel={ (option) => option }
                                onChange={ (_, value) => field.onChange(value) }
                                value={ field.value }
                                renderInput={ (params) => 
                                    <TextField 
                                        onChange={ (value) => field.onChange(value) }
                                        helperText={ errors.storeAddress ? t("text.requiredField") : "" } 
                                        error={ Boolean(errors.storeAddress) } 
                                        { ...params } 
                                        label={ t("text.storeAddress") } 
                                    /> 
                                }
                            />
                        );
                    } }
                >
                </Controller>
                <div className="control-buttons">
                    <Button type="submit" variant="contained">{ t("text.confirm") }</Button>
                    <Button onClick={ props.close } variant="contained">{ t("text.close") }</Button>
                </div>
            </form>
        </div>
    );
}