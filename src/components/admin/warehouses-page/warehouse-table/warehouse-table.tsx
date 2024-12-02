import { IStore } from '../../../../interfaces/interfaces';
import './warehouse-table.scss';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { useProvidersHelper } from '../../../../helpers/use-providers-helper';

export default function WarehouseTable (props: { currentStoreInfo: IStore }) {
    
    const [totals, setTotals] = useState({
        remains: 0,
        cost: 0
    });
    const { providers } = useProvidersHelper();

    useEffect(() => {
        const totalInfo = { remains: 0, cost: 0 };
        props.currentStoreInfo.products.map(product => {
            totalInfo.remains += product.amount;
            totalInfo.cost += product.productInfo.variations[0].price * product.amount;
        });
        setTotals(totalInfo);
    }, [props.currentStoreInfo]);
    
    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: t("text.partNumber"), width: 100 },
        {
            field: 'image',
            headerName: t("text.image"),
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => <img className='image' src={ params.value } />
        },        
        { field: 'product', headerName: t("text.product"), width: 150 },
        { 
            field: 'stock', 
            headerName: t("text.inStock"), 
            width: 150,
            renderCell: (params) => (
                <div className={ params.value === t("text.inStock") ? "in-stock" : "not-in-stock" }>{ params.value }</div>
            ) 
        },
        { field: 'remains', headerName: t("text.remains"), width: 100 },
        { field: 'provider', headerName: t("text.provider"), flex: 1 },
        { field: 'price', headerName: t("text.priceForEach"), width: 150 },
        { field: 'cost', headerName: t("text.cost"), width: 150 }
    ];
    
    const rows = props.currentStoreInfo.products.map((product) => {
        const providerData = providers.find(provider => provider.id === Number(product.productInfo.provider));
        return {
            id: product.productId,
            image: product.productInfo.images[0],
            product: product.productInfo.name,
            stock: product.amount !== 0 ? t("text.inStock") : t("text.notInStock"),
            remains: product.amount,
            provider: providerData?.name,
            price: product.productInfo.variations[0].price,
            cost: product.amount * product.productInfo.variations[0].price
        };
    });

    return (
        <div className='table'>
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
            <div className="totals">
                { t("text.total") }: { totals.remains } { t("text.pcs") } / { totals.cost } { t("text.rub") }
            </div>
        </div>
    );
}