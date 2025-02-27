import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../stores";
import "./main.scss";
import { useEffect, useState } from "react";
import { IStaticPageInfo } from "../../../models/static-page-generator/static-page-generator";
import { getStaticPagesInfo } from "../../../models/static-page-generator/static-page-generator-api";
import { Link } from "react-router-dom";
import Header from "../../partials/header/header";
import BreadCrumbs from "../../pages/breadcrumbs/bread-crumbs";

interface IMainLayoutProps {
    children: React.ReactElement | null
}

export default function MainLayout({ children }: IMainLayoutProps) {

    const userStore = useStore().userStore;
    const [staticPages, setStaticPages] = useState<IStaticPageInfo[]>([]);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavigateToCatalog = () => {
        navigate("/shop");
    };

    useEffect(() => {
        getStaticPagesInfo().then(res => {
            if (res.data.pages) {
                setStaticPages(res.data.pages.filter(el => el.isPublished));
            }
        });
    }, []);

    return (
        <div className="main-layout">
            <Header />
            { userStore.user ? <BreadCrumbs /> : null }
            <div className="main-menu">
                {
                    userStore.user ?
                    <>
                        <Button
                            variant="contained"
                            className="catalog-button"
                            onClick={ handleNavigateToCatalog }
                        >
                            { t("text.catalog") }
                        </Button>
                        <TextField
                            className="search-input"
                            placeholder={ t("text.siteSearch") }
                            InputProps={ {
                                endAdornment: (
                                    <IoMdSearch fontSize={ 25 } />
                                ),
                            } }
                        />
                    </> : null
                }
                {
                    staticPages.map(el => (
                        <Link 
                            key={ el.id } 
                            to={ `/static/${el.id}` }
                            className="static-page-link"
                        >
                            { el.menuTitle }
                        </Link>
                    ))
                }
            </div>
            <div className="main-children">
                { children }
            </div>
        </div>
    );
}