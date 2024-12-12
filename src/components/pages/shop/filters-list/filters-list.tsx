import { Checkbox } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./filters-list.scss";

interface IFiltersListProps {
    
}

interface IFilter {
    id: number,
    active: boolean,
    title: string
}

export default function FiltersList() {

    const { t } = useTranslation();
    const [filtersInfo, setFiltersInfo] = useState<IFilter[]>([
        { id: 1, active: false, title: "В наличии" },
        { id: 2, active: false, title: "Нет в продаже" }
    ]);

    return (
        <div className="filters-view">
            <div className="filters-title">
                Фильтры
            </div>
            <div className="filters-list">
                {
                    filtersInfo.map(el => {
                        return (
                            <div key={ el.id } className="filter-wrapper">
                                <div className="filter-select">
                                    <Checkbox />
                                </div>
                                <div className="filter-title">
                                    { el.title }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}