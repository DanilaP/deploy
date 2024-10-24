import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IPermission, IPermissionGroup, IRole } from '../../../../interfaces/interfaces';
import { Checkbox } from '@mui/material';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../../../configs/axiosconfig/axios';
import CustomModal from '../../../../components-ui/custom-modal/custom-modal';
import { checkConcretePermissions } from '../../../../helpers/permissions-helpers';

export default function TableComponent(props: { 
    update: (data: IRole[]) => void, 
    roles: IRole[], 
    permissions: IPermission[],
    permissionsGroups: IPermissionGroup[],
}) {

    const [isModalShown, setIsModalShown] = useState<boolean>(false);
    const [choosenRole, setChoosenRole] = useState<IRole>();
    const permissionsExists = checkConcretePermissions();
    const { t } = useTranslation();
    
    const updateRole = (roleName: string, permissionName: string, isChecked: boolean) => {
        if (permissionsExists.ModifyRoles) {
            const newRoles = props.roles.map((role: IRole) => {
                if (role.name === roleName) {
                    if (isChecked) {
                        return { name: role.name, permissions: [...role.permissions, permissionName] };
                    }
                    else {
                        const filteredPermissions = role.permissions.filter((currPerm: string) => currPerm !== permissionName);
                        return { name: role.name, permissions: filteredPermissions };
                    }
                } else return role;
            });
            props.update(newRoles);
        }
    };

    const updateRoleFromGroup = (roleName: string, permissionsGroup: IPermissionGroup, isChecked: boolean) => {
        if (permissionsExists.ModifyRoles) {
            const newRoles = props.roles.map((role: IRole) => {
                if (role.name === roleName) {
                    if (isChecked) {
                        return { ...role, permissions: [...role.permissions, ...permissionsGroup.permissions] };
                    } else {
                        return { ...role, permissions: role.permissions.filter((permission: string) => !permissionsGroup.permissions.includes(permission) ) };
                    } 
                } else return role;
            });
            props.update(newRoles);
        }
    };

    const openModal = (role: IRole) => {
        setChoosenRole(role);
        setIsModalShown(true);
    };

    const deleteRole = () => {
        const newRoles = props.roles.filter((role: IRole) => role.name !== choosenRole?.name);
        props.update(newRoles);
        setIsModalShown(false);
    };
    
    const getPermissionsWithGroup = () => {
        return props.permissionsGroups.reduce((prev: string[], group: IPermissionGroup) => {
            return [...prev, ...group.permissions];
        }, []);
    };

    return (
        <>
        <TableContainer component={ Paper }>
            <Table sx={ { minWidth: 350 } } size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>{ t("text.permitionsRules") }</TableCell>
                        {
                            props.roles.map((role: IRole) => {
                                return (
                                <TableCell key={ role.name }>
                                    <div className='role'>
                                        { role.name }
                                    </div>
                                    { permissionsExists.DeleteRoles &&
                                        <div onClick={ () => openModal(role) } className="delete-button">{ t("text.deleteRole") }</div>
                                    }
                                </TableCell>);
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.permissionsGroups.map((permissionsGroup: IPermissionGroup, groupIndex) => {
                            return (
                                <Fragment key = { permissionsGroup.name }>
                                    <TableRow style={{
                                        marginTop: "20px",
                                        backgroundColor: "#2993fd39"
                                    }}>
                                        <TableCell style={{ textTransform: "uppercase", color: "var(--text-color)" }}>
                                            { permissionsGroup.name }
                                        </TableCell>
                                        {
                                            props.roles.map((role: IRole) => {
                                                let groupChecked = true;
                                                permissionsGroup.permissions.map(el => {
                                                    if (!role.permissions.includes(el)) {
                                                        groupChecked = false;
                                                    }
                                                });

                                                return (
                                                    <TableCell key={ permissionsGroup.name + role.name }>
                                                        <Checkbox
                                                            disabled = { !permissionsExists.ModifyRoles }
                                                            onChange={ (e) => updateRoleFromGroup(role.name, permissionsGroup, e.target.checked) } 
                                                            checked = { groupChecked }
                                                        >
                                                        </Checkbox>
                                                    </TableCell>
                                                );
                                            })
                                        }
                                    </TableRow>
                                    {
                                        permissionsGroup.permissions.map((permission: string, permInfex) => {
                                            return (
                                                <TableRow 
                                                    key={ permission }
                                                    style={
                                                        groupIndex === props.permissionsGroups.length - 1 &&
                                                        permInfex === permissionsGroup.permissions.length - 1
                                                        ? { borderBottom: "2px solid #1976d2" }
                                                        : { borderBottom: "none" }
                                                    }
                                                >
                                                    <TableCell style={ { paddingLeft: "40px" } }>
                                                        { t("permissions." + permission) }
                                                    </TableCell>
                                                    {
                                                        props.roles.map((role: IRole) => {
                                                            return (
                                                                <TableCell key={ permission + role.name } >
                                                                    <Checkbox
                                                                        disabled = { !permissionsExists.ModifyRoles }
                                                                        onChange={ (e) => updateRole(role.name, permission, e.target.checked) } 
                                                                        checked = { role.permissions?.includes(permission) ? true : false }>
                                                                    </Checkbox>
                                                                </TableCell>
                                                            );
                                                        })
                                                    }
                                                </TableRow>
                                            );
                                        })
                                    }
                                </Fragment>
                            );
                        })
                    }
                    {
                        props.permissions.map(el => {
                            const permissionsWithGroup = getPermissionsWithGroup();
                            if (!permissionsWithGroup.includes(el.name)) {
                                return (
                                    <TableRow key={ el.name }>
                                        <TableCell>
                                            { t("permissions." + el.name) }
                                        </TableCell>
                                        {
                                            props.roles.map((role: IRole) => {
                                                return (
                                                    <TableCell key={ el.name + role.name }>
                                                        <Checkbox
                                                            disabled = { !permissionsExists.ModifyRoles }
                                                            onChange={ (e) => updateRole(role.name, el.name, e.target.checked) } 
                                                            checked = { role.permissions?.includes(el.name) ? true : false }>
                                                        </Checkbox>
                                                    </TableCell>
                                                );
                                            })
                                        }
                                    </TableRow>
                                );
                            }
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
        <CustomModal 
            isDisplay={ isModalShown }
            title = { t("text.confirm") }
            typeOfActions='default'
            actionConfirmed={ deleteRole }
            closeModal={ () => setIsModalShown(false) }
        >
            <div>{ `${ t("text.deleteRole") } ${ choosenRole?.name }` }</div>
        </CustomModal>
        </>
    );
}