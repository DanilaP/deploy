import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import './store-creator.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import { options } from './constants/constants';

export default function StoreCreator (props: { 
    isValid: boolean, 
    setNewStoreInfo: (info: any) => void, 
    newStoreInfo: any 
}) {

    const [addresses, setAddresses] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (props.newStoreInfo?.address?.length >= import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH) {
            axios.post("http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", 
                JSON.stringify({ query: props.newStoreInfo.address }), 
                options
            ).then((res) => {
                setAddresses(res.data.suggestions.map(el => el.value));
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }, [props.newStoreInfo.address]);

    return (
        <div className="store-creator">
            <TextField 
                className={ props.isValid ? "valid" : "not-valid" }
                onChange={ (e) => props.setNewStoreInfo({ ...props.newStoreInfo, name: e.target.value }) } 
                placeholder={ t("text.storeName") }
            />
            <Autocomplete
                options={ addresses }
                onChange={(_, value) => props.setNewStoreInfo({ ...props.newStoreInfo, address: value })}
                renderInput={ (params) => 
                    <TextField 
                        {...params} label={ t("text.storeAddress") } 
                        onChange={(e) => props.setNewStoreInfo({ ...props.newStoreInfo, address: e.target.value })}
                    /> 
                }
            />
        </div>
    );
}