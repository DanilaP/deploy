import { Checkbox, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./filters-list.scss";

export interface IFilters { 
    inStock: boolean,
    price: {
        min: number,
        max: number | null
    }
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

    const handleUpdatePriceFilter = (
        min: string | number, 
        max: string | number | null
    ) => {
        handleUpdateFilters({
            ...filters,
            price: {
                min: min ? Number(min) : 0,
                max: max ? Number(max) : null
            }
        });
    };

    return (
        <div className="filters-view">
            <div className="filters-title">
                { t("text.filters") }
            </div>
            <div className="filters-list">
                {
                    Object.keys(filters).map(filterName => {
                        if (typeof filters[filterName] === "boolean") {
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
                        }
                        if (filterName === "price") {
                            return (
                                <div key={ filterName } className="price-filter">
                                    <div className="price-filter-title">{ t("text.filterByPrice") }</div>
                                    <TextField 
                                        placeholder={ `${t("text.price")} ${t("text.from")} ` }
                                        type="number"
                                        onChange={ 
                                            (e) => handleUpdatePriceFilter(e.target.value, filters.price.max) 
                                        }
                                    />
                                    <TextField 
                                        placeholder={ `${t("text.price")} ${t("text.to")} ` }
                                        type="number"
                                        onChange={ 
                                            (e) => handleUpdatePriceFilter(filters.price.min, e.target.value) 
                                        }
                                    />
                                </div>
                            );
                        }
                    })
                }
            </div>
        </div>
    );
}