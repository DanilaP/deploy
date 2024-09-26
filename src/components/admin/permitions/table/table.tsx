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
import { useState } from 'react';

export default function TableComponent(props: {roles: IRole[], permitions: IPermition[]}) {

    const [updatedRoles, setUpdatedRoles] = useState<IRole[]>(props.roles);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell>Роли</TableCell>
                    {
                        props.permitions.map((permition: IPermition) => {
                            return <TableCell key={permition.name}>{permition.name}</TableCell>;
                        })
                    }
                </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.roles.map((role: IRole) => {
                            return (
                                <TableRow key={role.name}>
                                    <TableCell>
                                        {role.name}
                                    </TableCell>
                                    {
                                        props.permitions.map((permition: IPermition) => {
                                            return (
                                                <TableCell key={permition.name}>
                                                    <Checkbox 
                                                        defaultChecked = {role.permitions.includes(permition.name) ? true : false}>
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