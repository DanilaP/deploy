import { Checkbox, Rating } from '@mui/material';
import { MdOutlineFavorite } from 'react-icons/md';
import './favorite-item.scss';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { IProduct } from '../../../../../models/products/products';
import { getAverageEvaluation } from '../../../../../helpers/product-page-helpers';

export default function FavoriteItem (props: { 
    product: IProduct, 
    delete: (event: any, id: number) => void,
    changeChoosenProducts: (products: IProduct[]) => void,
    choosenProducts: IProduct[],
}) {
    
    const [isActive, setIsActive] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const changeInputState = () => {
        if (!isActive) {
            props.changeChoosenProducts([...props.choosenProducts, props.product]);
        }
        else {
            const filteredProducts = props.choosenProducts.filter((product) => product.id !== props.product.id);
            props.changeChoosenProducts(filteredProducts);
        }
    };

    useEffect(() => {
        if (props.choosenProducts.filter((product: IProduct) => product.id === props.product.id).length > 0) {
            setIsActive(true);
        } 
        else {
            setIsActive(false);
        }
    }, [props.choosenProducts]);
    
    return (
        <div onClick={ changeInputState } className={ isActive ? "favorite active" : "favorite inactive" } >
            <img onClick={ () => navigate(`/shop/product/${ props.product.id }`) } className='image' src={ props.product.images[0] } />
            <div className="info">
                <div className="name">{ props.product.name }</div>
                <div className="description">{ props.product.description }</div>
                <Rating
                    name="half-rating"
                    precision={ 0.5 }
                    readOnly
                    value = { Number(getAverageEvaluation(props.product.reviews)) }
                />
                <Checkbox checked={ isActive ? true : false } onChange={ changeInputState } className='checkbox' />
            </div>
            <div className="settings">
                <div className="price">{ props.product.variations[0].price } { t("text.rub") }</div>
                <div className="main">
                    <MdOutlineFavorite onClick={ (e) => props.delete(e, props.product.id) } className='icon' />
                </div>
            </div>
        </div>
    );
}