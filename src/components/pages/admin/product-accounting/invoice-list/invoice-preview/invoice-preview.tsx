import { LiaFileInvoiceSolid } from "react-icons/lia";
import { t } from "i18next";
import './invoice-preview.scss';
import { IInvoice } from "../../../../../../models/invoice/invoice";

export default function InvoicePreview (props: { invoice: IInvoice }) {
    
    return (
        <div className="invoice-preview">
            <div className="invoice-img">
                <LiaFileInvoiceSolid className='icon' />
            </div>
            <div className="invoice-type list-item">
                { props.invoice.type === "receipt" ? t("text.receiptInvoice") : t("text.expenseInvoice") }
            </div>
            <div className="invoice-id list-item">
                { props.invoice.id }
            </div>
            <div className="invoice-provider list-item">
                { props.invoice.provider }
            </div>
            <div className="invoice-status list-item">
                { props.invoice.status }
            </div>
            <div className="invoice-date list-item">
                { props.invoice.dateFrom }
            </div>
        </div>
    );
}