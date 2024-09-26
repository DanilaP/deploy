import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import $api from '../../../configs/axiosconfig/axios';
import { IPermition, IRole } from "../../../interfaces/interfaces";
import './permitions.scss';
import TableComponent from "./table/table";
import { Button } from "@mui/material";

export default function PermitionsPage () {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permitions, setPermitions] = useState<IPermition[]>([]);

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
                <TableComponent roles={roles} permitions={permitions} />
            </div>
            <div className="saveButton">
                <Button variant="contained">Сохранить изменения</Button>
            </div>
        </div>
    );
}