import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import $api from '../../../configs/axiosconfig/axios';
import { IPermission, IPermissionGroup, IRole } from "../../../interfaces/interfaces";
import './roles.scss';
import TableComponent from "./roles-table/table";
import { Button, TextField } from "@mui/material";
import { checkConcretePermissions } from "../../../helpers/permissions-helpers";

export default function RolesPage () {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [permissionsGroups, setPermissionsGroups] = useState<IPermissionGroup[]>([]);
    const [newRole, setNewRole] = useState<IRole>({ name: "", permissions: [] });
    const permissionsExists = checkConcretePermissions();

    const updateRolesInfo = () => {
        $api.put("/roles", { roles })
        .then((res) => {
            setRoles(() => res.data.roles);
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
        document.title = t("titles.rolesPage");
    });
    
    useEffect(() => {
        $api.get("/permissions")
        .then((res) => {
            setRoles(res.data.roles);
            setPermissions(res.data.permissions);
            setPermissionsGroups(res.data.permissionsGroups);
        })
        .catch((error) => {
            console.error(t("methods.getPermitionsMethod"), error);
        });
    }, []);
    
    return (
        <div className="roles">
            <div className="roles-add-role">
                {
                    permissionsExists.CreateRoles ?
                    <>
                        <TextField onChange={ (e) => setNewRole({ ...newRole, name: e.target.value }) } placeholder="Роль" />
                        <Button onClick={ addNewRole } variant="contained">{ t("text.addRole") }</Button>
                    </> : null
                }
                {
                    permissionsExists.ModifyRoles ?
                    <div className="save-button">
                        <Button onClick={ updateRolesInfo } variant="contained">{ t("text.saveChanges") }</Button>
                    </div> : null
                }
            </div>
            <div className="roles-content">
                <TableComponent 
                    permissionsGroups = { permissionsGroups } 
                    update = { setRoles } 
                    roles={ roles } 
                    permissions={ permissions }
                />
            </div>
        </div>
    );
}