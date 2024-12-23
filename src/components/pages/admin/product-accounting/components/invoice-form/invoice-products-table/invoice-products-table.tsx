import { t } from 'i18next';
import './invoice-products-table.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IInvoice } from '../../../../../../../models/invoice/invoice';
import { useEffect, useState } from 'react';
import { IProduct } from '../../../../../../../models/products/products';
import { getProducts } from '../../../../../../../models/products/products-api';

export default function InvoiceProductsTable (props: { invoiceInfo: IInvoice, completed: boolean }) {

    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: "№", width: 140 },
        {
            field: 'productName',
            headerName: 'Номенклатура',
            width: 200,
            renderCell: (params) => 
                <>
                    <Autocomplete
                        onChange={ (event, value) => changeCellValue(params, value) }
                        disabled = { props.completed }
                        value={ params.value }
                        options={ products?.map((product: IProduct) => product.name) }
                        sx={ { width: 200 } }
                        renderInput={ (params) => <TextField { ...params }/> }
                    />
                </>
        },        
        { 
            field: 'amount', 
            headerName: "Количество", 
            width: 150 ,
            renderCell: (params) => 
                <>
                    <TextField 
                        onChange={ (event) => changeCellValue(params, event.target.value) }
                        disabled = { props.completed } 
                        defaultValue={ params.value } 
                        type='number' 
                    />
                </>
        },
        { 
            field: 'price', 
            headerName: "Цена", 
            width: 150,
            renderCell: (params) => 
                <>
                    <TextField 
                        onChange={ (event) => changeCellValue(params, event.target.value) }
                        disabled = { props.completed } 
                        defaultValue={ params.value } 
                        type='number' 
                    />
                </>
        },
        { 
            field: 'sum', 
            headerName: "Сумма", 
            width: 150,
            renderCell: (params) => 
                <>
                    <TextField 
                        disabled = { true } 
                        value={ params.value } 
                        type='number' 
                    />
                </>
        },
    ];
    
    const baserows = props.invoiceInfo.products.map((product) => {
        return {
            id: product.id + Date.now(),
            productName: product.name,
            amount: product.amount,
            price: product.price,
            sum: product.amount * product.price
        };
    });

    const [rows, setRows] = useState(baserows);
    const [products, setProducts] = useState<IProduct[]>([]);

    const addRow = () => {
        setRows([...rows, {
            id: Date.now(),
            productName: "",
            amount: 0,
            price: 0,
            sum: 0
        }]);
    };

    const changeCellValue = (params: any, cellValue: string | number) => {
        const newRows = rows.map((row) => {
            if (row.id === params.id) {
                return {
                    ...row,
                    [params.colDef.field]: cellValue,
                    sum: (params.colDef.field === "price")
                        ? row.amount * Number(cellValue)
                        : (params.colDef.field === "amount") 
                            ? row.price * Number(cellValue)
                            : row.sum
                };
            } else return row;
        });
        setRows(newRows);
    };

    useEffect(() => {
        getProducts()
        .then((res) => {
            setProducts(res.data.products);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className='invoice-products-table'>
            <div className="invoice-products-settings">
                <Button 
                    disabled = { props.completed } 
                    onClick={ addRow } 
                    variant='contained'
                >
                    Добавить
                </Button>
            </div>
            <DataGrid
                localeText={ ruRU.components.MuiDataGrid.defaultProps.localeText }
                rows={ rows }
                columns={ columns }
                initialState={ {
                    pagination: {
                            paginationModel: {
                            pageSize: 5,
                        },
                    },
                } }
                disableRowSelectionOnClick
                pageSizeOptions={ [5, 10, { value: -1, label: t("text.all") }] }
            />
        </div>
    );
}