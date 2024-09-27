import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import $api from '../../../configs/axiosconfig/axios';
import { IPermition, IRole } from "../../../interfaces/interfaces";
import './roles.scss';
import TableComponent from "./roles-table/table";
import { Button, TextField } from "@mui/material";

export default function PermitionsPage () {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permitions, setPermitions] = useState<IPermition[]>([]);
    const [newRole, setNewRole] = useState<IRole>({ name: "", permitions: [] });

    const updateRolesInfo = () => {
        $api.put("/roles", { roles })
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(t("methods.updateRolesMethod"), error);
        });
    };

    const addNewRole = () => {
        $api.post("/roles", newRole)
        .then((res) => {
            setRoles(res.data.roles);
        })
        .catch((error) => {
            console.error(t("methods.addRoleMethod"), error);
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
        <div className="roles">
            <div className="roles-add-role">
                <TextField onChange={ (e) => setNewRole({ ...newRole, name: e.target.value }) } placeholder="Роль" />
                <Button onClick={ addNewRole } variant="contained">{ t("text.addRole") }</Button>
            </div>
            <div className="roles-content">
                <TableComponent update = { setRoles } roles={ roles } permitions={ permitions } />
            </div>
            <div className="save-button">
                <Button onClick={ updateRolesInfo } variant="contained">{ t("text.saveChanges") }</Button>
            </div>
        </div>
    );
}