import { t } from 'i18next';
import './invoice-products-table.scss';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { Button } from '@mui/material';
import { IInvoice } from '../../../../../../models/invoice/invoice';

export default function InvoiceProductsTable (props: { invoiceInfo: IInvoice }) {
    
    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: "№", width: 100 },
        {
            field: 'productName',
            headerName: 'Номенклатура',
            width: 150,
            //renderCell: (params) => <img className='image' src={ params.value } />
        },        
        { field: 'amount', headerName: "Количество", width: 150 },
        { field: 'price', headerName: "Цена", width: 150 },
        { field: 'sum', headerName: "Сумма", width: 100 },
    ];
    
    const rows = props.invoiceInfo.products.map((product) => {
        return {
            id: product.id,
            productName: product.name,
            amount: product.amount,
            price: product.price,
            sum: product.amount * product.price
        };
    });

    return (
        <div className='invoice-products-table'>
            <div className="invoice-products-settings">
                <Button variant='outlined'>Добавить</Button>
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