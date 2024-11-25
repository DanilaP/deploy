import { useTranslation } from "react-i18next";
import { DataGrid } from '@mui/x-data-grid';
import "./call-back-page-view.scss";
import { ICallBack } from "../../../interfaces/interfaces";
import { IconButton } from "@mui/material";
import { ruRU } from '@mui/x-data-grid/locales';
import { FiPlusCircle } from "react-icons/fi";

interface ICallBackPageViewProps {
    userCallbacksData: ICallBack[],
    userCallbacksDataGrid: { columns: any[], rows: any[] },
    handleOpenCallbackMoreInfo: (callbackId: number) => void
    handleOpenCreatingNewCallback: () => void
}

export default function CallBackPageView({ 
    userCallbacksData,
    userCallbacksDataGrid,
    handleOpenCallbackMoreInfo,
    handleOpenCreatingNewCallback
}: ICallBackPageViewProps) {

    const { t } = useTranslation();
    
    return (
        <div className="call-back-page">
            <div className="title">
                { t("text.yourActiveCallbacks") }
                <IconButton className="title-actions" onClick={ handleOpenCreatingNewCallback }>
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
                        rows={ userCallbacksDataGrid.rows }
                        onRowClick={ (el) => handleOpenCallbackMoreInfo(el.row.id) }
                        columns={ userCallbacksDataGrid.columns.map(el => {
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
                }
            </div>
        </div>
    );
}