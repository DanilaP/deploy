import { useEffect } from 'react';
import { useTranslation } from '../../translation/i18n';
import MediaCard from './card/card';
import './shop.scss';
import { Button, Menu, MenuItem, Select, TextField } from '@mui/material';


export default function ShopPage () {

    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("titles.shopPage");
    });

    return (
        <div className='shop-wrapper'>
            <div className="shop-products-wrapper">
                <div className="shop-filters">
                    <TextField placeholder='Поиск'></TextField>
                    <Button variant="contained">{ t("text.find") }</Button>
                    <Button variant="contained">{ t("text.filters") }</Button>
                    <Select defaultValue="all">
                        <MenuItem value="all">{ t("text.categories") }</MenuItem>
                        <MenuItem value = "Категория 1">Категория 1</MenuItem>
                        <MenuItem value = "Категория 2">Категория 2</MenuItem>
                        <MenuItem value = "Категория 3">Категория 3</MenuItem>
                    </Select>
                </div>
                <div className="shop-content">
                    <MediaCard />
                    <MediaCard />
                    <MediaCard />
                    <MediaCard />
                    <MediaCard />
                    <MediaCard />
                    <MediaCard />
                    <MediaCard />
                </div>
            </div>
            <div className="shop-footer"></div>
        </div>
    );
}