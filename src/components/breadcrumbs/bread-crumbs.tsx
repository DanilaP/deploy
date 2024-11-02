import './bread-crumbs.scss';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { adminRoutes, routes } from '../../routes';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function BreadCrumbs () {

    const allRoutes = [...routes, ...adminRoutes];
    const breadcrumbs = useBreadcrumbs<any>(allRoutes);

    useEffect(() => {
        console.log(breadcrumbs);
    }, [breadcrumbs]);
    
    return (
        <div className='bread-crumbs'>
            <Breadcrumbs>
            {
                breadcrumbs.map(({ breadcrumb, match }) => (
                    <div key={ match.pathname }>
                        <Link to={ match.pathname }>
                            { breadcrumb }
                        </Link>
                    </div>
                ))
            }
            </Breadcrumbs>
        </div>
    );
}