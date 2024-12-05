import { useEffect, useState } from 'react';
import { useTranslation } from '../../../translation/i18n';
import MediaCard from './card/card';
import './shop.scss';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { IProduct } from '../../../interfaces/interfaces';
import { getProducts } from '../../../models/products/products-api';

export default function ShopPage () {

    const { t } = useTranslation();
    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        document.title = t("titles.shopPage");
    }, []);

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
        <div className='shop-wrapper'>
            <div className="shop-products-wrapper">
                <div className="shop-filters">
                    <TextField className='filter-input' placeholder='Поиск'></TextField>
                    <Button className='filter-button' variant="contained">{ t("text.find") }</Button>
                    <Button className='filter-button' variant="contained">{ t("text.filters") }</Button>
                    <Select defaultValue="all">
                        <MenuItem value="all">{ t("text.categories") }</MenuItem>
                        <MenuItem value = "Категория 1">Категория 1</MenuItem>
                        <MenuItem value = "Категория 2">Категория 2</MenuItem>
                        <MenuItem value = "Категория 3">Категория 3</MenuItem>
                    </Select>
                </div>
                <div className="shop-content">
                    {
                        products!.map((product: IProduct) => {
                            return <MediaCard key={ product.id } product = { product } />;
                        })
                    }
                </div>
            </div>
            <div className="shop-footer"></div>
        </div>
    );
}