import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import $api from '../../../configs/axiosconfig/axios';
import './products-store.scss';
import { IStore } from '../../../interfaces/interfaces';
import { Button, Checkbox, MenuItem, Select, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import StoreTable from './store-table/store-table';
import CustomModal from '../../../components-ui/custom-modal/custom-modal';
import StoreCreator from './store-creator/store-creator';

export default function ProductsStore () {

    const { t } = useTranslation();
    const [stores, setStores] = useState<IStore[]>([]);
    const [currentStoreInfo, setCurrentStoreInfo] = useState<IStore>();
    const [filteredStoreInfo, setFilteredStoreInfo] = useState<IStore>();
    const [onlyNotInStock, setOnlyNotInStock] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [newStoreInfo, setNewStoreInfo] = useState<any>({});

    const changeStore = (storeId: number | string) => {
        const storeInfo = stores.find((el) => el.id === storeId);
        setCurrentStoreInfo(storeInfo);
        setFilteredStoreInfo(storeInfo);
        setOnlyNotInStock(false);
    };

    const sortByStockNumber = () => {
        if (!onlyNotInStock) {
            setOnlyNotInStock(true);
            let newStoreInfo = {
                ...currentStoreInfo,
                products: currentStoreInfo?.products.filter((product) => product.amount === 0)
            }
            setFilteredStoreInfo(newStoreInfo);
        } else {
            setOnlyNotInStock(false);
            setFilteredStoreInfo(currentStoreInfo);
        }
    };

    const startSearching = (str: string) => {
        if (str !== "") {
            let filteredProducts = currentStoreInfo?.products.filter((product) => {
                let info = product.productInfo;
                let fields = [info.id.toString(), info.name, info.category, info.provider];
                if (fields.filter(field => field.toLocaleLowerCase().includes(str.toLocaleLowerCase())).length > 0) {
                    return true;
                }
            })
            setFilteredStoreInfo({
                ...currentStoreInfo,
                products: filteredProducts
            });
        } else setFilteredStoreInfo(currentStoreInfo);
    };

    const addStore = () => {
        let newStore = {
            id: Date.now(),
            name: newStoreInfo.name,
            address: newStoreInfo.address,
            products: []
        }
        setStores([...stores, newStore]);
        setModalOpen(false);
    };

    useEffect(() => {
        document.title = t("titles.productsStorePage");
    }, []);

    useEffect(() => {
        $api.get("/stores")
        .then((res) => {
            setStores(res.data.stores);
            setCurrentStoreInfo(res.data.stores[0]);
            setFilteredStoreInfo(res.data.stores[0]);
        })
        .catch((error) => {
            console.error(error);
        })
    }, []);

    return (
        <div className='products-store'> 
            <div className="products-store-header">
                <div className="choosen-store">
                    {
                       (stores.length !== 0) && (
                            <Select onChange={ (e) => changeStore(e.target.value) } defaultValue={ stores[0].id }>
                                {
                                    stores.map((store: IStore) => {
                                        return <MenuItem key={ store.id } value = { store.id }>{ store.name }</MenuItem>
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
                    <Button onClick={ () => setModalOpen(true) } variant='contained'>{ t("text.addStore") }</Button>
                </div>
            </div>
            <div className="store-info">
                <div className="address">{ t("text.storeAddress") }: { currentStoreInfo?.address }</div>
            </div>
            <div className="products-store-content">
                { filteredStoreInfo && <StoreTable currentStoreInfo={ filteredStoreInfo } /> }
            </div>
            <CustomModal
                children={ <StoreCreator newStoreInfo = { newStoreInfo } setNewStoreInfo = { setNewStoreInfo } /> }
                isDisplay = { modalOpen }
                closeModal={ () => setModalOpen(false) }
                actionConfirmed={ addStore }
                title={ t("text.addStore") }
                typeOfActions='default'
            >
            </CustomModal>
        </div>
    );
}