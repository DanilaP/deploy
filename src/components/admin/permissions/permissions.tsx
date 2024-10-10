import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './permissions.scss';
import { Button, TextField } from '@mui/material';
import { IPermission, IPermissionGroup } from '../../../interfaces/interfaces';
import $api from '../../../configs/axiosconfig/axios';
import PermissionsList from './permissions-list/permissions-list';
import PermissionsGroupList from './permissions-group-list/permissions-group-list';

export default function PermissionsPage () {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [permissionsGroups, setPermissionsGroups] = useState<IPermissionGroup[]>([]);
    const [newGroup, setNewGroup] = useState<string>("");
    const [currentDragOverGroup, setCurrentDragOverGroup] = useState<IPermissionGroup | null>();
    const [choosenPermition, setChoosenPermition] = useState<string>("");
    const [isDraggingFromGroupToGroup, setIsDraggingFromGroupToGroup] = useState<{ from: string } | null>(null);
        

    const createGroupOfPermissions = () => {
        if (newGroup !== "") {
            $api.post("/permissions/groups", { name: newGroup })
            .then((res) => {
                setPermissionsGroups(res.data.permissionsGroups);
            })
            .catch((error) => {
                console.error(t("methods.createGroupOfPermissions"), error);
            });
        }
    };

    const deleteGroupOfPermissions = (group: IPermissionGroup) => {
        $api.delete(`/permissions/groups?name=${ group.name }`)
        .then((res) => {
            setPermissionsGroups(res.data.permissionsGroups);
        })
        .catch((error) => {
            console.error(t("methods.deleteGroupOfPermissions"), error);
        });
    };

    const dragStart = (permission: string, from: IPermissionGroup | null) => {
        if (from !== null) {
            setIsDraggingFromGroupToGroup({ from: from.name });
        }
        setChoosenPermition(permission);
    };
    
    const dragEnd = () => {
        if (!currentDragOverGroup?.permissions.includes(choosenPermition)) {
            if (isDraggingFromGroupToGroup === null) {
                const newGroupInfo = permissionsGroups.map((group: IPermissionGroup) => {
                    if (group.name === currentDragOverGroup?.name) {
                        return { ...group, permissions: [...group.permissions, choosenPermition] };
                    } else return group;
                });
                setPermissionsGroups(newGroupInfo);
                setCurrentDragOverGroup(null);
            } else {
                const newGroupInfo = permissionsGroups.map((group: IPermissionGroup) => {
                    if (group.name === isDraggingFromGroupToGroup.from) {
                        return { ...group, permissions: group.permissions.filter((permission: string) => permission !== choosenPermition) };
                    }
                    else if (group.name === currentDragOverGroup?.name) {
                        return { ...group, permissions: [...group.permissions, choosenPermition] };
                    } else return group;
                });
                setPermissionsGroups(newGroupInfo);
                setIsDraggingFromGroupToGroup(null);
            }
        }
    };
    
    const dragOver = (group: IPermissionGroup | null) => {
        setCurrentDragOverGroup(group);
    };

    const deletePermissionFromGroup = (permissionName: string, groupName: string) => {
        const newGroupsInfo = permissionsGroups.map((group: IPermissionGroup) => {
            if (group.name === groupName) {
                return { ...group, permissions: group.permissions.filter((permission: string) => permission !== permissionName) };
            } else return group;
        });
        setPermissionsGroups(newGroupsInfo);
    };

    const saveChanges = () => {
        $api.put("/permissions/groups", { permissionsGroups: permissionsGroups })
        .catch((error) => {
            console.error(t("methods.changeGroupOfPermissions"), error);
        });
    };

    useEffect(() => {
        document.title = t("titles.permissionsPage");
    });

    useEffect(() => {
        $api.get("/permissions/groups")
        .then((res) => {
            setPermissions(res.data.permissions);
            setPermissionsGroups(res.data.permissionsGroups);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className='permissions'>
            <div className="permissions-settings">
                <TextField onChange={ (e) => setNewGroup(e.target.value) } placeholder={ t("text.groupName") }></TextField>
                <Button onClick={ createGroupOfPermissions } variant='contained'>{ t("text.createGroup") }</Button>
                <Button onClick={ saveChanges } variant='contained'>{ t("text.saveChanges") }</Button>
            </div>
            <div className="permissions-content">
                <div className="permissions-list">
                    <PermissionsList dragOver = { dragOver } dragEnd = { dragEnd } dragStart = { dragStart } permissions={ permissions } />
                </div>
                <div className="groups-list">
                    <PermissionsGroupList deletePermission = { deletePermissionFromGroup } 
                    dragOver = { dragOver } dragEnd = { dragEnd } dragStart = { dragStart }  
                    deleteGroup={ deleteGroupOfPermissions } permissionsGroups={ permissionsGroups } />
                </div>
            </div>
        </div>
    );
}