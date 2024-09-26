import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import $api from '../../../configs/axiosconfig/axios';
import { IPermition, IRole } from "../../../interfaces/interfaces";
import './permitions.scss';
import TableComponent from "./permitions-table/table";
import { Button } from "@mui/material";

export default function PermitionsPage () {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permitions, setPermitions] = useState<IPermition[]>([]);


    const updateRolesInfo = () => {
        $api.put("/roles", { roles })
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(t("methods.updateRolesMethod"), error);
        });
    };

    useEffect(() => {
        document.title = t("titles.permitionsPage");
    });
    
    useEffect(() => {
        $api.get("/permitions")
        .then((res) => {
            setRoles(res.data.roles);
            setPermitions(res.data.permitions);
        })
        .catch((error) => {
            console.error(t("methods.getPermitionsMethod"), error);
        });
    }, []);
    
    return (
        <div className="permitions">
            <div className="permitions__header">
                <h3>{ t("titles.permitionsPage") }</h3>
            </div>
            <div className="permitions__content">
                <TableComponent update = { setRoles } roles={ roles } permitions={ permitions } />
            </div>
            <div className="saveButton">
                <Button onClick={ updateRolesInfo } variant="contained">Сохранить изменения</Button>
            </div>
        </div>
    );
}