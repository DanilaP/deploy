import { useTranslation } from 'react-i18next';
import './invoice-form.scss';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import InvoiceProductsTable from './invoice-products-table/invoice-products-table';
import { IInvoice } from '../../../../../models/invoice/invoice';
import { IWarehouse } from '../../../../../models/warehouse/warehouse';

export default function InvoiceForm (props: { invoice: IInvoice, stores: IWarehouse[], close: () => void }) {
    
    const { t } = useTranslation();

    return (
        <div className='invoice-wrapper'>
            <div className="invoice-header">
                <TextField label = "Номер накладной" defaultValue={ props.invoice.id } />
                <TextField label = "Контрагент" defaultValue={ props.invoice.provider } />
                <TextField type='date' label = "Дата" defaultValue={ props.invoice.dateFrom } />
                <Select 
                    defaultValue={ props.invoice.warehouse } 
                >
                    {
                        props.stores.map((store: IWarehouse) => {
                            return <MenuItem key={ store.id } value = { store.id }>{ store.name }</MenuItem>;
                        })
                    }
                </Select>
            </div>
            <div className="invoice-products">
                <InvoiceProductsTable invoiceInfo={ props.invoice } />
            </div>
            <div className='buttons'>
                <Button onClick={ props.close } variant='contained'>Провести</Button>
                <Button onClick={ props.close } variant='contained'>Отменить</Button>
            </div>
        </div>
    );
}