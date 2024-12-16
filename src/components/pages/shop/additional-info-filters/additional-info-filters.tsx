import { MenuItem, Select } from "@mui/material";
import "./additional-info-filters.scss";
import { useTranslation } from "react-i18next";

interface IAdditionalInfoFiltersProps {
    additionalInfoFilterOptions: Record<string, {
        title: string;
        value: any;
    }[]>,
    additionalInfoValues: Record<string, string>,
    handleUpdateAdditionalInfoValues: (systemKey: string, value: string) => void,
    handleClearAdditionalInfoFilters: () => void
}

export default function AdditionalInfoFilters({
    additionalInfoFilterOptions,
    additionalInfoValues,
    handleUpdateAdditionalInfoValues,
    handleClearAdditionalInfoFilters
}: IAdditionalInfoFiltersProps) {

    const { t } = useTranslation();

    return (
        <div className="characteristics-wrapper">
            <div className="characteristics-list">
                {
                    Object.keys(additionalInfoFilterOptions).map((el: string) => {
                        const placeholder = additionalInfoFilterOptions[el][0].title;
                        const currentValue = additionalInfoValues[el];
                        return (
                            <Select 
                                key={ el }
                                placeholder="test"
                                value={ currentValue || "default" }
                                onChange={ (e) => handleUpdateAdditionalInfoValues(el, e.target.value) }
                            >
                                <MenuItem disabled value="default">{ placeholder }</MenuItem>
                                {
                                    additionalInfoFilterOptions[el].map(el => {
                                        return (
                                            <MenuItem
                                                key={ el.value }
                                                className="filter-option"
                                                value={ el.value }
                                            >
                                                { el.value }
                                            </MenuItem>
                                        );
                                    })
                                }
                            </Select>
                        );
                    })
                }
            </div>
            <div 
                className="characteristics-filter-clear"
                onClick={ handleClearAdditionalInfoFilters }
            >
                { t("text.clear") }
            </div>
        </div>
    );
}