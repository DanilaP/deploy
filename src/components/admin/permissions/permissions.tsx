import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './permissions.scss';
import { Button, TextField } from '@mui/material';
import { IPermission, IPermissionGroup } from '../../../interfaces/interfaces';
import $api from '../../../configs/axiosconfig/axios';
import PermissionsList from './permissions-list/permissions-list';
import PermissionsGroupList from './permissions-group-list/permissions-group-list';
import { checkConcretePermissions } from '../../../helpers/permissions-helpers';
import useDebounceFunction from '../../../helpers/use-debounce';

export default function PermissionsPage () {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [permissionsGroups, setPermissionsGroups] = useState<IPermissionGroup[]>([]);
    const [newGroup, setNewGroup] = useState<string>("");
    const [currentDragEnterGroup, setCurrentDragEnterGroup] = useState<IPermissionGroup | null>();
    const [choosenPermition, setChoosenPermition] = useState<string>("");
    const [dragStartGroup, setDragStartGroup] = useState<IPermissionGroup | null>(null);
    const permissionsExists = checkConcretePermissions();

    const saveChanges = () => {
        $api.put("/permissions/groups", { permissionsGroups: permissionsGroups })
        .catch((error) => {
            console.error(t("methods.changeGroupOfPermissions"), error);
        });
    };

    const debouncedUpdatePermission = useDebounceFunction(saveChanges, 500);

    const createGroupOfPermissions = () => {
        let isGroupAlreadyExists = false;
        permissionsGroups.map((group: IPermissionGroup) => {
            if (newGroup === group.name) {
                isGroupAlreadyExists = true;
            }
        });
        if (newGroup !== "" && !isGroupAlreadyExists) {
            setPermissionsGroups([...permissionsGroups, { name: newGroup, permissions: [] }]);
        }
    };

    const deleteGroupOfPermissions = (deletedGroup: IPermissionGroup) => {
        const newPermissionsGroups = permissionsGroups;
        setPermissionsGroups(newPermissionsGroups.filter((group: IPermissionGroup) => group.name !== deletedGroup.name));
    };

    const dragStart = (permission: string, from: IPermissionGroup | null) => {
        setDragStartGroup(from);
        setCurrentDragEnterGroup(from);
        setChoosenPermition(permission);
    };

    const dragEnterGroup = (group: IPermissionGroup | null) => {
        setCurrentDragEnterGroup(group);
    };
    
    const dragEnterPermission = (permission: string) => {
        if (permission !== choosenPermition) {
            //Если переносим внутри одной группы
            if (currentDragEnterGroup?.name === dragStartGroup?.name) {
                const newGroups = permissionsGroups.map((group: IPermissionGroup) => {
                    if (group.name === currentDragEnterGroup?.name) {
                        return {
                            ...group,
                            permissions: group.permissions.reduce((prev: string[], perm: string) => {
                                if (perm === permission) return [...prev, choosenPermition];
                                if (perm ===  choosenPermition) return [...prev, permission];
                                return [...prev, perm];
                            }, [])
                        };
                    } else return group;
                });
                setPermissionsGroups(newGroups);
            } 
            //Если переносим в другую группу
            else {
                const newGroups = permissionsGroups.map((group: IPermissionGroup) => {
                    if (group.name === currentDragEnterGroup?.name) {
                        //Если группа не пустая
                        if (group.permissions.length !== 0) {
                            return {
                                ...group,
                                permissions: !group.permissions.includes(choosenPermition)
                                    ? group.permissions.reduce((prev: string[], perm: string) => {
                                        if (perm === permission) {
                                            setDragStartGroup(group);
                                            return [...prev, choosenPermition, permission];
                                        }
                                        return [...prev, perm];
                                    }, [])
                                    : group.permissions
                            };
                        }
                    }
                    //Удаляем из старой группы перетаскиваемый пермишн
                    if (group.name === dragStartGroup?.name) {
                        return { 
                            ...group, 
                            permissions: group.permissions.filter((permission: string) => permission !== choosenPermition) 
                        };
                    }
                    else return group;
                });
                setPermissionsGroups(newGroups);
            }
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
   
    useEffect(() => {
        //Если перетаскиваем в пустую группу
        if (currentDragEnterGroup?.permissions.length === 0) {
            const newGroups = permissionsGroups.map((currentGroup: IPermissionGroup) => {
                if (currentGroup.name === currentDragEnterGroup?.name) {
                    setDragStartGroup(currentDragEnterGroup);
                    return {
                        ...currentGroup,
                        permissions: [...currentGroup.permissions, choosenPermition]
                    };
                } 
                if (currentGroup.name === dragStartGroup?.name) {
                    return { 
                        ...currentGroup, 
                        permissions: currentGroup.permissions.filter((permission: string) => permission !== choosenPermition) 
                    };
                }
                else return currentGroup;

            });
            setPermissionsGroups(newGroups);
        }
    }, [currentDragEnterGroup]);

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
    
    useEffect(() => {
        if (permissionsExists.ModifyGroupOfPermissions && permissionsGroups.length !== 0) {
            debouncedUpdatePermission();
        }
    }, [permissionsGroups]);

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
            </div>
            <div className="permissions-content">
                <div className="permissions-list">
                    <PermissionsList 
                        dragEnterPermission = { dragEnterPermission }
                        permissionsGroups = { permissionsGroups } 
                        dragEnter = { dragEnterGroup } 
                        dragStart = { dragStart } 
                        permissions={ permissions } />
                </div>
                <div className="groups-list">
                    <PermissionsGroupList 
                        dragEnterPermission = { dragEnterPermission }
                        deletePermission = { deletePermissionFromGroup } 
                        dragEnter = { dragEnterGroup } 
                        dragStart = { dragStart }  
                        deleteGroup={ deleteGroupOfPermissions }
                        permissionsGroups={ permissionsGroups } 
                    />
                </div>
            </div>
        </div>
    );
}