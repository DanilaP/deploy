import * as React from 'react';
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

export default function TableComponent(props: { update: (data: IRole[]) => void, roles: IRole[], permitions: IPermition[] }) {

    const [updatedRoles, setUpdatedRoles] = useState<IRole[]>(props.roles);
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

    useEffect(() => {
        setUpdatedRoles(props.roles);
    }, [props.roles]);

    return (
        <TableContainer component={ Paper }>
            <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell>{ t("text.roles") }</TableCell>
                    {
                        props.permitions.map((permition: IPermition) => {
                            return <TableCell key={ permition.name }>{ permition.name }</TableCell>;
                        })
                    }
                </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.roles.map((role: IRole) => {
                            return (
                                <TableRow key={ role.name }>
                                    <TableCell>
                                        { role.name }
                                    </TableCell>
                                    {
                                        props.permitions.map((permition: IPermition) => {
                                            return (
                                                <TableCell key={ permition.name }>
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
    );
}