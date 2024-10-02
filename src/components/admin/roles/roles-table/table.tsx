import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IPermission, IRole } from '../../../../interfaces/interfaces';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../../../configs/axiosconfig/axios';
import CustomModal from '../../../../components-ui/custom-modal/custom-modal';

export default function TableComponent(props: { update: (data: IRole[]) => void, roles: IRole[], permissions: IPermission[] }) {

    const [updatedRoles, setUpdatedRoles] = useState<IRole[]>(props.roles);
    const [isModalShown, setIsModalShown] = useState<boolean>(false);
    const [choosenRole, setChoosenRole] = useState<IRole>();

    const { t } = useTranslation();
    
    const updateRole = (roleName: string, permissionName: string, isChecked: boolean) => {
        const newRoles = updatedRoles.map((role: IRole) => {
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
    };

    const openModal = (role: IRole) => {
        setChoosenRole(role);
        setIsModalShown(true);
    };

    const deleteRole = () => {
        $api.delete(`/roles?name=${choosenRole?.name}`)
        .then((res) => {
            props.update(res.data.roles);
        })
        .catch((error) => {
            console.error(t("methods.deleteRoleMethod"), error);
        });
        setIsModalShown(false);
    };

    useEffect(() => {
        setUpdatedRoles(props.roles);
    }, [props.roles]);

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
                                <div onClick={ () => openModal(role) } className="delete-button">{ t("text.deleteRole") }</div>
                            </TableCell>);
                        })
                    }
                </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.permissions.map((permission: IPermission) => {
                            return (
                                <TableRow key={ permission.name }>
                                    <TableCell>
                                        { t("permissions." + permission.name) }
                                    </TableCell>
                                    {
                                        props.roles.map((role: IRole) => {
                                            return (
                                                <TableCell key={ role.name }>
                                                    <Checkbox
                                                        onChange={ (e) => updateRole(role.name, permission.name, e.target.checked) } 
                                                        defaultChecked = { role.permissions?.includes(permission.name) ? true : false }>
                                                    </Checkbox>
                                                </TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            );
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