import './bread-crumbs.scss';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { adminRoutes, routes } from '../../routes';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function BreadCrumbs () {

    const location = useLocation();
    const breadcrumbs = useBreadcrumbs<any>([...routes, ...adminRoutes]);
    const [fixedBreadCrumbs, setFixedBreadCrumbs] = useState<any>([]);

    useEffect(() => {
        const fixedArrayOfBreadCrumbs = breadcrumbs.reduce((prev: any[], el: any) => {
            if (el.match.params.hasOwnProperty("*")) {
                return prev;
            } else {
                if (Object.keys(el.match.params).length !== 0) {
                    return [
                        ...prev,
                        { ...el, breadcrumb: {
                            ...el.breadcrumb,
                            props: {
                                ...el.breadcrumb.props,
                                children: el.breadcrumb.props.children + " " + Object.values(el.match.params)[0]
                            }
                        } }
                    ];
                }
                return [...prev, el];
            }
        }, []);
        setFixedBreadCrumbs(fixedArrayOfBreadCrumbs);
    }, [location.pathname]);
    
    return (
        <div className='bread-crumbs'>
            <Breadcrumbs>
                {
                    fixedBreadCrumbs.map(({ breadcrumb, match }) => (
                        <div key={ match.pathname }>
                            <Link className='bread-crumbs-link' to={ match.pathname }>
                                { breadcrumb }
                            </Link>
                        </div>
                    ))
                }
            </Breadcrumbs>
        </div>
    );
}