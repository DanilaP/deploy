import { Checkbox } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./filters-list.scss";

export interface IFilters { 
    inStock: boolean,
    [key: string]: any
}

interface IFiltersListProps {
    filters: IFilters,
    handleUpdateFilters: (filters: IFilters) => void
}

export default function FiltersList({ 
    filters,
    handleUpdateFilters
}: IFiltersListProps) {

    const { t } = useTranslation();

    const handleUpdateCheckboxFilter = (filterName: string, checked: boolean) => {
        handleUpdateFilters({
            ...filters,
            [filterName]: checked
        });
    };

    return (
        <div className="filters-view">
            <div className="filters-title">
                Фильтры
            </div>
            <div className="filters-list">
                {
                    Object.keys(filters).map(filterName => {
                        return (
                            <div key={ filterName } className="filter-wrapper">
                                <div className="filter-select">
                                    <Checkbox
                                        onChange={ (e) => handleUpdateCheckboxFilter(filterName, e.target.checked) }
                                        value={ filters[filterName] }
                                    />
                                </div>
                                <div className="filter-title">
                                    { t(`text.${filterName}`) }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}