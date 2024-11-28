import { useTranslation } from "react-i18next";
import { DataGrid } from '@mui/x-data-grid';
import { IFeedBack } from "../../../interfaces/interfaces";
import { IconButton } from "@mui/material";
import { ruRU } from '@mui/x-data-grid/locales';
import { FiPlusCircle } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import "./feed-back-page-view.scss";

interface IFeedBackPageViewProps {
    userCallbacksData: IFeedBack[],
    userCallbacksDataGrid: { columns: any[], rows: any[] },
    handleOpenCallbackMoreInfo: (callbackId: number) => void,
    handleOpenEditCallbackModal: (callbackId: number) => void,
    handleOpenCreatingNewCallback: () => void
}

export default function FeedBackPageView({ 
    userCallbacksData,
    userCallbacksDataGrid,
    handleOpenCallbackMoreInfo,
    handleOpenEditCallbackModal,
    handleOpenCreatingNewCallback
}: IFeedBackPageViewProps) {

    const { t } = useTranslation();
    
    const userEnhancedCallbacksDataGrid = {
        ...userCallbacksDataGrid,
        columns: [
            ...userCallbacksDataGrid.columns,
            { field: "edit", headerName: t("text.edit"), minWidth: 150 },
        ]
    };

    return (
        <div className="call-back-page">
            <div className="title">
                { t("text.yourActiveCallbacks") }
                <IconButton 
                    className="title-actions" 
                    onClick={ handleOpenCreatingNewCallback }
                >
                    <FiPlusCircle />
                </IconButton>
            </div>
            <div className="content">
                { userCallbacksData.length === 0 
                    ? 
                    <div className="helper-text">
                        { t("text.youHaveNoCallbacksYet") }
                    </div>
                    : 
                    <DataGrid   
                        className="callback-data-table"
                        rows={ userEnhancedCallbacksDataGrid.rows }
                        onRowClick={ (el) => handleOpenCallbackMoreInfo(el.row.id) }
                        columns={ userEnhancedCallbacksDataGrid.columns.map(el => {
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
                            if (el.field === "edit") {
                                return {
                                    ...el,
                                    renderCell: (params) => {
                                        const currentCallbackInList = 
                                            userCallbacksData.find(callback => callback.id === params.id);
                                        return (
                                            <div className="callback-edit-icon">
                                                {
                                                    !currentCallbackInList?.solved 
                                                        ? 
                                                        <IconButton 
                                                            className="mui-icon-button"
                                                            onClick={ (e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenEditCallbackModal(Number(params.id));
                                                                } 
                                                            }
                                                        >
                                                            <FaRegEdit fontSize={ 25 } />
                                                        </IconButton> 
                                                        : null
                                                }
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
                }
            </div>
        </div>
    );
}