import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './product-accounting.scss';
import $api from '../../../../configs/axiosconfig/axios';
import InvoiceList from './components/invoice-list/invoice-list';
import CustomModal from '../../../components-ui/custom-modal/custom-modal';
import InvoiceForm from './components/invoice-form/invoice-form';
import { IInvoice } from '../../../../models/invoice/invoice';
import { IWarehouse } from '../../../../models/warehouse/warehouse';

export default function ProductAccounting () {

    const { t } = useTranslation();
    const [invoices, setInvoices] = useState<IInvoice[]>();
    const [stores, setStores] = useState<IWarehouse[]>();
    const [currentInvoice, setCurrentInvoice] = useState<IInvoice>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const changeInvoice = (invoice: IInvoice) => {
        setCurrentInvoice(invoice);
        setIsModalOpen(true);
    };

    useEffect(() => {
        $api.get("/warehouses")
        .then((res) => {
            setStores(res.data.stores);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        $api.get("/invoices")
        .then((res) => {
            setInvoices(res.data.invoices);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        document.title = t("titles.productAccounting");
    }, []);

    return (
        <div className='product-accounting-wrapper'>
            { invoices && <InvoiceList changeInvoice = { changeInvoice } invoices={ invoices } /> }
            {
                currentInvoice && stores &&
                <CustomModal
                    isDisplay = { isModalOpen }
                    closeModal = { () => setIsModalOpen(false) }
                    actionConfirmed = { () => setIsModalOpen(false) }
                    title = { t("text.invoiceForm") }
                    typeOfActions='none'
                >
                    <InvoiceForm close = { () => setIsModalOpen(false) } stores={ stores } invoice={ currentInvoice } />
                </CustomModal>
            }
        </div>
    );
}