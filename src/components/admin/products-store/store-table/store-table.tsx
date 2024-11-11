import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { IStore } from '../../../../interfaces/interfaces';
import './store-table.scss';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { t } from 'i18next';

export default function StoreTable (props: { currentStoreInfo: IStore }) {

    const navigate = useNavigate();
    const [totals, setTotals] = useState({
        remains: 0,
        cost: 0
    });

    useEffect(() => {
        const totalInfo = { remains: 0, cost: 0 };
        props.currentStoreInfo.products.map(product => {
            totalInfo.remains += product.amount,
            totalInfo.cost += product.productInfo.variations[0].price * product.amount
        })
        setTotals(totalInfo);
    }, [props.currentStoreInfo]);

    return (
        <>
            <TableContainer component={ Paper }>
                <Table sx={ { minWidth: 350 } } size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{ t("text.product") }</TableCell>
                            <TableCell>{ t("text.inStock") }</TableCell>
                            <TableCell>{ t("text.remains") }</TableCell>
                            <TableCell>{ t("text.provider") }</TableCell>
                            <TableCell>{ t("text.priceForEach") }</TableCell>
                            <TableCell>{ t("text.cost") }</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.currentStoreInfo?.products.map((product) => {
                                return (
                                    <TableRow key={ product.productId } >
                                        <TableCell>
                                            <div className="cell-product-main">
                                                <img 
                                                    onClick={ () => navigate(`/shop/product/${ product.productId }`) } 
                                                    src={ product.productInfo.images[0] } className="image"
                                                />
                                                <div className="cell-product">
                                                    <div className="name">{ product.productInfo.name }</div>
                                                    <div className="additional-info">
                                                        <div className="id">{ product.productInfo.id + "/" }</div>
                                                        <div className="category">{ product.productInfo.category }</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{ 
                                            (product.amount > 0) 
                                                ? <div className='in-stock'>{ t("text.inStock") }</div>  
                                                : <div className='not-in-stock'>{ t("text.notInStock") }</div>  }
                                        </TableCell>
                                        <TableCell>{ product.amount }</TableCell>
                                        <TableCell>{ product.productInfo.provider }</TableCell>
                                        <TableCell>{ product.productInfo.variations[0].price }</TableCell>
                                        <TableCell>{ product.amount * product.productInfo.variations[0].price }</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                <div className="table-footer">
                                    { t("text.total") }: { totals.remains } { t("text.pcs") } / { totals.cost } { t("text.rub") }
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}