import { Button, TextField } from "@mui/material";
import "./main.scss";
import { useNavigate } from "react-router";

interface IMainLayoutProps {
    children: React.ReactElement | null
}

export default function MainLayout({ children }: IMainLayoutProps) {

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
                    Каталог
                </Button>
                <TextField
                    className="search-input"
                    placeholder="Поиск по сайту"
                />
            </div>
            <div className="main-children">
                { children }
            </div>
        </div>
    );
}