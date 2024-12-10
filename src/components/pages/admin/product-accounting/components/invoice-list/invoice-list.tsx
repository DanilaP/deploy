import { IInvoice } from '../../../../../../models/invoice/invoice';
import './invoice-list.scss';
import InvoicePreview from './invoice-preview/invoice-preview';

export default function InvoiceList (props: { invoices: IInvoice[], changeInvoice: (invoice: IInvoice) => void }) {
    
    return (
        <div className='invoice-list'>
            {
                props.invoices.map((invoice: IInvoice) => {
                    return (
                        <div onClick={ () => props.changeInvoice(invoice) } key={ invoice.id }>
                            <InvoicePreview invoice={ invoice } />
                        </div>
                    );
                })
            }
        </div>
    );
}