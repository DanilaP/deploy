import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IPermition, IRole } from '../../../../interfaces/interfaces';
import { Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../../../configs/axiosconfig/axios';
import CustomModal from '../../../../components-ui/custom-modal/custom-modal';

export default function TableComponent(props: { update: (data: IRole[]) => void, roles: IRole[], permitions: IPermition[] }) {

    const [updatedRoles, setUpdatedRoles] = useState<IRole[]>(props.roles);
    const [isModalShown, setIsModalShown] = useState<boolean>(false);
    const [choosenRole, setChoosenRole] = useState<IRole>();

    const { t } = useTranslation();
    
    const updateRole = (roleName: string, permitionName: string, isChecked: boolean) => {
        const newRoles = updatedRoles.map((role: IRole) => {
            if (role.name === roleName) {
                if (isChecked) {
                    return { name: role.name, permitions: [...role.permitions, permitionName] };
                }
                else {
                    const filteredPermitions = role.permitions.filter((currPerm: string) => currPerm !== permitionName);
                    return { name: role.name, permitions: filteredPermitions };
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
                        props.permitions.map((permition: IPermition) => {
                            return (
                                <TableRow key={ permition.name }>
                                    <TableCell>
                                        { permition.name }
                                    </TableCell>
                                    {
                                        props.roles.map((role: IRole) => {
                                            return (
                                                <TableCell key={ role.name }>
                                                    <Checkbox
                                                        onChange={ (e) => updateRole(role.name, permition.name, e.target.checked) } 
                                                        defaultChecked = { role.permitions.includes(permition.name) ? true : false }>
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