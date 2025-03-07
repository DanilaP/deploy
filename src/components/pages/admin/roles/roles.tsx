import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import $api from '../../../../configs/axiosconfig/axios.js';
import { IPermission } from "../../../../interfaces/interfaces.ts";
import './roles.scss';
import { Button, TextField } from "@mui/material";
import usePermissions from "../../../../helpers/permissions-helpers.ts";
import { IRole } from "../../../../models/role/role.ts";
import { IPermissionGroup } from "../../../../models/permission-group/permission-group.ts";
import TableComponent from "./components/roles-table/table.tsx";
import { updateRole } from "../../../../models/role/role-api.ts";

export default function RolesPage () {
    const { t } = useTranslation();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [permissionsGroups, setPermissionsGroups] = useState<IPermissionGroup[]>([]);
    const [newRole, setNewRole] = useState<IRole>({ name: "", permissions: [] });

    const { checkConcretePermissions } = usePermissions();
    const permissionsExists = checkConcretePermissions();

    const updateRolesInfo = () => {
        updateRole(roles)
        .catch((error) => {
            console.error(t("methods.updateRolesMethod"), error);
        }); 
    };

    const addNewRole = () => {
        const newRoles = [...roles, newRole];
        setRoles(newRoles);
    };

    useEffect(() => {
        document.title = t("titles.rolesPage");
    }, []);

    useEffect(() => {
        if (roles.length !== 0 && permissionsExists.ModifyRoles) {
            updateRolesInfo();
        }
    }, [roles]);

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
