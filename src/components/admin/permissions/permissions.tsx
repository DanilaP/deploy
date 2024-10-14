import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './permissions.scss';
import { Button, TextField } from '@mui/material';
import { IPermission, IPermissionGroup } from '../../../interfaces/interfaces';
import $api from '../../../configs/axiosconfig/axios';
import PermissionsList from './permissions-list/permissions-list';
import PermissionsGroupList from './permissions-group-list/permissions-group-list';
import { checkConcretePermissions } from '../../../helpers/permissions-helpers';

export default function PermissionsPage () {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [permissionsGroups, setPermissionsGroups] = useState<IPermissionGroup[]>([]);
    const [newGroup, setNewGroup] = useState<string>("");
    const [currentDragOverGroup, setCurrentDragOverGroup] = useState<IPermissionGroup | null>();
    const [choosenPermition, setChoosenPermition] = useState<string>("");
    const [isDraggingFromGroupToGroup, setIsDraggingFromGroupToGroup] = useState<IPermissionGroup | null>(null);
    const [changedPermission, setChangedPermission] = useState<string>("");
    const permissionsExists = checkConcretePermissions();

    const createGroupOfPermissions = () => {
        if (newGroup !== "") {
            setPermissionsGroups([...permissionsGroups, { name: newGroup, permissions: [] }]);
        }
    };

    const deleteGroupOfPermissions = (deletedGroup: IPermissionGroup) => {
        const newPermissionsGroups = permissionsGroups;
        setPermissionsGroups(newPermissionsGroups.filter((group: IPermissionGroup) => group.name !== deletedGroup.name));
    };

    const dragStart = (permission: string, from: IPermissionGroup | null) => {
        if (from !== null) {
            setIsDraggingFromGroupToGroup(from);
        }
        setChoosenPermition(permission);
    };

    const dragOver = (group: IPermissionGroup | null) => {
        setCurrentDragOverGroup(group);
    };

    const dragOverPermission = (permission: string) => {
        setChangedPermission(permission);
    };

    const dragEnd = () => {
        //Если перемещаем из одной группы в другую
        if (currentDragOverGroup?.name !== isDraggingFromGroupToGroup?.name) {
            const newGroups = permissionsGroups.map((group: IPermissionGroup) => {
                //Добавляем перетаскиваемый пермишн в группу на определенное место
                if (group.name === currentDragOverGroup?.name) {
                    //Если группа не пустая
                    if (group.permissions.length !== 0) {
                        const newPermissions = group.permissions.map((permission: string) => {
                            if (permission === changedPermission) {
                                return [choosenPermition, permission];
                            } 
                            else return permission;
                        });
                        return {
                            ...group,
                            permissions: newPermissions.flat()
                        };
                    }
                    //Если группа пустая
                    else {
                        return {
                            ...group,
                            permissions: [...group.permissions, choosenPermition]
                        };
                    }
                } 
                //Удаляем из старой группы перетаскиваемый пермишн
                if (group.name === isDraggingFromGroupToGroup?.name) {
                    return { 
                        ...group, 
                        permissions: group.permissions.filter((permission: string) => permission !== choosenPermition) 
                    };
                }
                else return group;
            });
            setPermissionsGroups(newGroups);
            setIsDraggingFromGroupToGroup(null);
        }
        //Если меняем местами пермишны внутри одной группы
        else if (currentDragOverGroup?.name === isDraggingFromGroupToGroup?.name && isDraggingFromGroupToGroup) {
            const newGroups = permissionsGroups.map((group: IPermissionGroup) => {
                if (group.name === currentDragOverGroup?.name) {
                        const oldIndex = group.permissions.indexOf(choosenPermition);
                        const newIndex = group.permissions.indexOf(changedPermission);
                        const newPermissions = [...group.permissions];

                        newPermissions.splice(oldIndex, 1, changedPermission);
                        newPermissions.splice(newIndex, 1, choosenPermition);
                        return {
                            ...group,
                            permissions: newPermissions
                        };
                } else return group;
            });
            setPermissionsGroups(newGroups);
            setIsDraggingFromGroupToGroup(null);
        }
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
                {
                    permissionsExists.CreateGroupOfPermissions ? 
                    <>
                        <TextField 
                            onChange={ (e) => setNewGroup(e.target.value) } 
                            placeholder={ t("text.groupName") }>
                        </TextField>
                        <Button onClick={ createGroupOfPermissions } variant='contained'>{ t("text.createGroup") }</Button>
                    </> : null
                }
                {
                    permissionsExists.ModifyGroupOfPermissions ? 
                    <Button onClick={ saveChanges } variant='contained'>
                        { t("text.saveChanges") }
                    </Button> : null
                }
            </div>
            <div className="permissions-content">
                <div className="permissions-list">
                    <PermissionsList 
                        dragOverPermission = { dragOverPermission }
                        permissionsGroups = { permissionsGroups } 
                        dragOver = { dragOver } 
                        dragEnd = { dragEnd } 
                        dragStart = { dragStart } 
                        permissions={ permissions } />
                </div>
                <div className="groups-list">
                    <PermissionsGroupList 
                        dragOverPermission = { dragOverPermission }
                        deletePermission = { deletePermissionFromGroup } 
                        dragOver = { dragOver } 
                        dragEnd = { dragEnd } 
                        dragStart = { dragStart }  
                        deleteGroup={ deleteGroupOfPermissions }
                        permissionsGroups={ permissionsGroups } 
                    />
                </div>
            </div>
        </div>
    );
}