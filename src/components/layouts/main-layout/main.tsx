import { Button, TextField } from "@mui/material";
import "./main.scss";
import { useNavigate } from "react-router";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";

interface IMainLayoutProps {
    children: React.ReactElement | null
}

export default function MainLayout({ children }: IMainLayoutProps) {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavigateToCatalog = () => {
        navigate("/shop");
    };

    return (
        <div className="main-layout">
            <div className="main-menu">
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
            </div>
            <div className="main-children">
                { children }
            </div>
        </div>
    );
}