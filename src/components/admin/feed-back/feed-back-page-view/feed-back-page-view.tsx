import { MenuItem, Select, TextField } from "@mui/material";
import "./feed-back-page-view.scss";
import { useTranslation } from "react-i18next";
import { IoMdSearch } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';

interface IAdminFeedbackPageViewProps {
    feedbacksDataGrid: { columns: any[], rows: any[] },
    handleOpenFeedbackAsnwerModal: (feedbackId: number) => void,
    handleFilterUserFeedbacksDataGridByStatus: (status: boolean) => void,
    handleSearchFeedbacksByInputValue: (value: string) => void
}

export default function AdminFeedbackPageView({ 
    feedbacksDataGrid,
    handleOpenFeedbackAsnwerModal,
    handleFilterUserFeedbacksDataGridByStatus,
    handleSearchFeedbacksByInputValue
}: IAdminFeedbackPageViewProps) {

    const { t } = useTranslation();

    return (
        <div className="call-back-page-view">
            <div className="call-back-title">
                { t("text.managingFeedbacks") }
            </div>
            <div className="call-back-search">
                <TextField
                    onChange={ (e) => handleSearchFeedbacksByInputValue(e.target.value) } 
                    placeholder={ t("text.searchAll") }
                    InputProps={ {
                        startAdornment: (
                            <IoMdSearch fontSize={ 25 } />
                        ),
                    } }
                />
                <Select
                    className="call-back-status-filter"
                    defaultValue={ 2 }
                    onChange={ (e) => handleFilterUserFeedbacksDataGridByStatus(Boolean(e.target.value)) }
                >
                    <MenuItem value={ 2 } disabled>{ t("text.statusSearch") }</MenuItem>
                    <MenuItem value={ 1 }>{ t("text.solved") }</MenuItem>
                    <MenuItem value={ 0 }>{ t("text.waiting") }</MenuItem>
                </Select>
            </div>
            <div className="call-back-list">
                <DataGrid   
                    className="callback-data-table"
                    rows={ feedbacksDataGrid.rows }
                    disableColumnFilter
                    onRowClick={ (el) => handleOpenFeedbackAsnwerModal(el.row.id) }
                    columns={ feedbacksDataGrid.columns.map(el => {
                        if (el.field === "solved") {
                            return {
                                ...el,
                                renderCell: (params) => {
                                    return (
                                        <div
                                            className={ params.value ? "done-status" : "waiting-status" }
                                        >
                                            { params.value ? t("text.solved") : t("text.waiting") }
                                        </div>
                                    );
                                }
                            };
                        }
                        return el;
                    }) }
                    initialState={ {
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    } }
                    pageSizeOptions={ [5] }
                    disableRowSelectionOnClick
                    localeText={ ruRU.components.MuiDataGrid.defaultProps.localeText }
                />
            </div>
        </div>
    );
}