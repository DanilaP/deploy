import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../../../configs/axiosconfig/axios';
import './products-warehouse.scss';
import { Button, Checkbox, MenuItem, Select, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import WarehouseTable from './warehouse-table/warehouse-table';
import CustomModal from '../../../components-ui/custom-modal/custom-modal';
import WarehouseCreator from './warehouse-creator/warehouse-creator';
import { IWarehouse } from '../../../../models/warehouse/warehouse';

export default function ProductsWarehouse () {

    const { t } = useTranslation();
    const [stores, setStores] = useState<IWarehouse[]>([]);
    const [currentStoreInfo, setCurrentStoreInfo] = useState<IWarehouse>();
    const [filteredStoreInfo, setFilteredStoreInfo] = useState<IWarehouse>();
    const [onlyNotInStock, setOnlyNotInStock] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState({
        creatingStore: false,
        deletingStore: false
    });
    
    const changeStore = (storeId: number | string) => {
        const storeInfo = stores.find((el) => el.id === storeId);
        setCurrentStoreInfo(storeInfo);
        setOnlyNotInStock(false);
    };

    const sortByStockNumber = () => {
        if (!onlyNotInStock) {
            setOnlyNotInStock(true);
            const newStoreInfo = {
                ...currentStoreInfo,
                products: currentStoreInfo?.products.filter((product) => product.amount === 0)
            };
            setFilteredStoreInfo(newStoreInfo);
        } else {
            setOnlyNotInStock(false);
            setFilteredStoreInfo(currentStoreInfo);
        }
    };

    const startSearching = (str: string) => {
        setOnlyNotInStock(false);
        if (str !== "") {
            const filteredProducts = currentStoreInfo?.products.filter((product) => {
                const info = product.productInfo;
                const fields = [info.id.toString(), info.name, info.provider];
                if (fields.filter(field => field.toLocaleLowerCase().includes(str.toLocaleLowerCase())).length > 0) {
                    return true;
                }
            });
            setFilteredStoreInfo({
                ...currentStoreInfo,
                products: filteredProducts
            });
        } else setFilteredStoreInfo(currentStoreInfo);
    };

    const endManipulationWithStore = (storesInfo: IWarehouse[], currentStoreInfo: IWarehouse) => {
        setStores(storesInfo);
        setCurrentStoreInfo(currentStoreInfo);
        setModalOpen({ ...modalOpen, creatingStore: false , deletingStore: false });
    };

    const addStore = (storeName: string, storeAddress: string) => {
        if (storeName && storeAddress) {
            if (stores.filter(store => store.name === storeName).length === 0) {
                const newStore = {
                    id: Date.now(),
                    name: storeName,
                    address: storeAddress,
                    products: []
                };
                endManipulationWithStore([...stores, newStore], newStore);
            }
        }
    };

    const deleteStore = () => {
        const newStores = stores.filter((store: IWarehouse) => store.id !== currentStoreInfo?.id);
        const lastStore = newStores[newStores.length - 1];
        endManipulationWithStore(newStores, lastStore);
    };

    useEffect(() => {
        document.title = t("titles.productsStorePage");
    }, []);

    useEffect(() => {
        $api.get("/warehouses")
        .then((res) => {
            setStores(res.data.stores);
            setCurrentStoreInfo(res.data.stores[0]);
            setFilteredStoreInfo(res.data.stores[0]);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        setFilteredStoreInfo(currentStoreInfo);
    }, [currentStoreInfo]);

    return (
        <div className='products-store'> 
            <div className="products-store-header">
                <div className="choosen-store">
                    {
                       (stores.length !== 0) && (
                            <Select 
                                value={ currentStoreInfo?.id } 
                                onChange={ (e) => changeStore(e.target.value) } 
                                defaultValue={ stores[0].id }
                            >
                                {
                                    stores.map((store: IWarehouse) => {
                                        return <MenuItem key={ store.id } value = { store.id }>{ store.name }</MenuItem>;
                                    })
                                }
                            </Select>
                        )
                    }
                </div>
                <div className="filters">
                    <TextField 
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch className='icon' />
                            ),
                        } } 
                        onChange={ (e) => startSearching(e.target.value) }
                        placeholder={ t("text.searchByAllFields") }>  
                    </TextField>
                    <Button onClick={ sortByStockNumber } variant='outlined' className="check-stock">
                        { t("text.onlyNotInStock") } <Checkbox checked={ onlyNotInStock } />
                    </Button>
                    <Button 
                        onClick={ () => setModalOpen({ ...modalOpen, creatingStore: true }) } 
                        variant='contained'
                    >
                        { t("text.addStore") }
                    </Button>
                    <Button 
                        onClick={ () => setModalOpen({ ...modalOpen, deletingStore: true  }) } 
                        className='delete-button' 
                        variant='contained'
                        disabled = { currentStoreInfo ? (currentStoreInfo.products.length > 0 ? true : false) : true }
                    >
                        { t("text.deleteStore") }
                    </Button>
                </div>
            </div>
            <div className="store-info">
                <div className="address">{ t("text.storeAddress") }: { currentStoreInfo?.address }</div>
            </div>
            <div className="products-store-content">
                { filteredStoreInfo && <WarehouseTable currentStoreInfo={ filteredStoreInfo } /> }
            </div>
            <CustomModal
                isDisplay = { modalOpen.creatingStore }
                closeModal={ () => setModalOpen({ ...modalOpen, creatingStore: false }) }
                title={ t("text.addStore") }
                typeOfActions='none'
            >
                <WarehouseCreator
                    addStore = { addStore }
                    close = { () => setModalOpen({ ...modalOpen, creatingStore: false }) }
                /> 
            </CustomModal>
            <CustomModal
                isDisplay = { modalOpen.deletingStore }
                closeModal={ () => setModalOpen({ ...modalOpen, deletingStore: false }) }
                actionConfirmed={ deleteStore }
                title={ t("text.deleteStore") }
                typeOfActions='default'
            >
                <div>{ t("text.deleteStoreConfirmation") }</div>
            </CustomModal>
        </div>
    );
}