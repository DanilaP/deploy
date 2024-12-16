import { MenuItem, Select } from "@mui/material";
import "./additional-info-filters.scss";

interface IAdditionalInfoFiltersProps {
    additionalInfoFilterOptions: Record<string, {
        title: string;
        value: any;
    }[]>,
    additionalInfoValues: Record<string, string>,
    handleUpdateAdditionalInfoValues: (systemKey: string, value: string) => void
}

export default function AdditionalInfoFilters({
    additionalInfoFilterOptions,
    additionalInfoValues,
    handleUpdateAdditionalInfoValues
}: IAdditionalInfoFiltersProps) {

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
        </div>
    );
}