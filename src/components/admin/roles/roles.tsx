import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import $api from '../../../configs/axiosconfig/axios';
import { IPermission, IRole } from "../../../interfaces/interfaces";
import './roles.scss';
import TableComponent from "./roles-table/table";
import { Button, TextField } from "@mui/material";

export default function PermitionsPage () {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [newRole, setNewRole] = useState<IRole>({ name: "", permissions: [] });

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
        $api.get("/permissions")
        .then((res) => {
            setRoles(res.data.roles);
            setPermissions(res.data.permissions);
        })
        .catch((error) => {
            console.error(t("methods.getPermitionsMethod"), error);
        });
    }, []);
    
    return (
        <div className="roles">
            <div className="roles-content">
                <TableComponent update = { setRoles } roles={ roles } permissions={ permissions } />
            </div>
            <div className="roles-add-role">
                <TextField onChange={ (e) => setNewRole({ ...newRole, name: e.target.value }) } placeholder="Роль" />
                <Button onClick={ addNewRole } variant="contained">{ t("text.addRole") }</Button>
                <div className="save-button">
                <Button onClick={ updateRolesInfo } variant="contained">{ t("text.saveChanges") }</Button>
            </div>
            </div>
        </div>
    );
}