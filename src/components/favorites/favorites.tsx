import { useEffect, useState } from 'react';
import { useTranslation } from '../../translation/i18n';
import './favorites.scss';
import { Button, Checkbox } from '@mui/material';
import $api from '../../configs/axiosconfig/axios';
import { IProduct } from '../../interfaces/interfaces';
import FavoriteItem from './favorite-item/favorite-item';
import { useStore } from '../../stores';
import CustomModal from '../../components-ui/custom-modal/custom-modal';
import ModalContent from './modal-content/modal-content';
import { useNavigate } from 'react-router';


export default function Favorites () {

    const { t } = useTranslation();
    const [favorites, setFavorites] = useState<IProduct[]>([]);
    const [choosenProducts, setChoosenProducts] = useState<IProduct[]>([]);
    const [currentTotalInfo, setCurrentTotalInfo] = useState<{ sum: number, quantity: number }>({ sum: 0, quantity: 0 });
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [allProductSelected, setAllProductsSelected] = useState<boolean>(false);

    const navigate = useNavigate();
    const { userStore } = useStore();
    
    const deleteFavourite = (event: any, id: number) => {
        event.stopPropagation();
        setFavorites(() => favorites?.filter((product: IProduct) => product.id !== id));
        setChoosenProducts(() => choosenProducts?.filter((product: IProduct) => product.id !== id));
    };

    const clearFavourites = () => {
        setFavorites([]);
        setChoosenProducts([]);
    };

    const removeFromChoosenList = (id: number) => {
        let filteredListOfChoosenProducts = choosenProducts.filter((product) => product.id !== id);
        setChoosenProducts(filteredListOfChoosenProducts);
    };

    const chooseAllProducts = () => {
        if (allProductSelected) {
            setAllProductsSelected(false);
            setChoosenProducts([]);
        } else {
            setAllProductsSelected(true);
            setChoosenProducts(favorites);
        }
    }

    useEffect(() => {
        if (choosenProducts) {
            let sum = 0;
            choosenProducts.map((product: IProduct) => {
                sum += product.variations[0].price;
            })
            setCurrentTotalInfo({ sum: sum, quantity: choosenProducts.length });

            if (choosenProducts.length === 0) {
                setModalOpen(false);
                setAllProductsSelected(false);
            }
            else if (choosenProducts.length !== favorites.length) {
                setAllProductsSelected(false);
            } else {
                setAllProductsSelected(true);
            }
        }
    }, [choosenProducts])

    useEffect(() => {
        document.title = t("breadcrumbs.favorites");
    }, []);

    useEffect(() => {
        $api.get("/favorites")
        .then((res) => {
            setFavorites(res.data.favorites);
        })
        .catch((error) => {
            console.error(error);
        })
    }, []);

    useEffect(() => {
        let productIds = favorites?.map((product) => product.id);
        userStore.setUser({ ...userStore.user, favorites: productIds });
    }, [favorites]);

    return (
        <div className='favorites-main'>
            <h1 className='title'>{ t("breadcrumbs.favorites") }</h1>
            <div className="favorites-header">
                <div className="sum">
                    { 
                        `${ t("text.numberOfProducts") }: ${ currentTotalInfo.quantity } 
                        ${ t("text.amount") } ${ currentTotalInfo.sum } ${ t("text.rub") }` 
                    }
                </div>
                <div className="settings">
                    <Button onClick={ chooseAllProducts } className='choose-all-button' variant='outlined'>
                        <Checkbox checked = { allProductSelected } />
                        { t("text.selectAll") }
                    </Button>
                    <Button onClick={ clearFavourites } variant='outlined'>{ t("text.deleteAll") }</Button>
                    <Button 
                        onClick={ () => setModalOpen(true) } 
                        disabled = { currentTotalInfo!.quantity === 0 } 
                        variant='contained'
                    >
                        { t("text.buy") }
                    </Button>
                </div>
            </div>
            <div className="favorites-content">
                {
                    (favorites?.length !== 0) 
                    ?   
                        favorites?.map((product: IProduct) => {
                            return (
                                <FavoriteItem
                                    delete = { deleteFavourite } 
                                    key={ product.id } 
                                    product={ product } 
                                    changeChoosenProducts = { setChoosenProducts }
                                    choosenProducts={ choosenProducts }
                                />
                            )
                        })
                    : 
                        <div className='message'>{ t("text.favoritesAreClear") }</div>
                }
            </div>
            <CustomModal
                children={ <ModalContent removeProduct={ removeFromChoosenList } products={ choosenProducts } /> }
                isDisplay = { modalOpen }
                closeModal={ () => setModalOpen(false) }
                actionConfirmed={ () => navigate("/shop") }
                title={ t("text.addToBasket") }
                typeOfActions='default'
            >
            </CustomModal>
        </div>
    );
}