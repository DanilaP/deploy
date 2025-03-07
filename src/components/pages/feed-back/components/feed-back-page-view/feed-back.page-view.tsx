import { useTranslation } from "react-i18next";
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from "@mui/material";
import { ruRU } from '@mui/x-data-grid/locales';
import { FiPlusCircle } from "react-icons/fi";
import { FaRedo, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IFeedBack } from "../../../../../models/feedbacks/feedbacks";
import "./feed-back-page-view.scss";

interface IFeedBackPageViewProps {
    userFeedbacksData: IFeedBack[],
    userFeedbacksDataGrid: { columns: any[], rows: any[] },
    handleOpenFeedbackMoreInfo: (feedbackId: number) => void,
    handleOpenEditFeedbackModal: (feedbackId: number) => void,
    handleOpenDeleteFeedbackModal: (feedbackId: number) => void,
    handleOpenRedoFeedbackModal: (feedbackId: number) => void,
    handleOpenCreatingNewFeedback: () => void,
    handleCheckIsChildrenExistsForFeedback: (feedbackId: number) => boolean,
}

export default function FeedBackPageView({ 
    userFeedbacksData,
    userFeedbacksDataGrid,
    handleOpenFeedbackMoreInfo,
    handleOpenEditFeedbackModal,
    handleOpenDeleteFeedbackModal,
    handleOpenRedoFeedbackModal,
    handleOpenCreatingNewFeedback,
    handleCheckIsChildrenExistsForFeedback
}: IFeedBackPageViewProps) {

    const { t } = useTranslation();
    
    const userEnhancedFeedbacksDataGrid = {
        rows: [...userFeedbacksDataGrid.rows].sort((prev, next) => {
            if (prev.createdAt < next.createdAt) return -1;
            return 1;
        }),
        columns: [
            ...userFeedbacksDataGrid.columns,
            { field: "actions", headerName: t("text.actions"), minWidth: 130, headerAlign: "center" },
        ]
    };

    return (
        <div className="call-back-page">
            <div className="title">
                { t("text.yourActiveFeedbacks") }
                <IconButton 
                    className="title-actions" 
                    onClick={ handleOpenCreatingNewFeedback }
                >
                    <FiPlusCircle />
                </IconButton>
            </div>
            <div className="content">
                { userFeedbacksData.length === 0 
                    ? 
                    <div className="helper-text">
                        { t("text.youHaveNoFeedbacksYet") }
                    </div>
                    : 
                    <DataGrid
                        className="callback-data-table"
                        rows={ userEnhancedFeedbacksDataGrid.rows }
                        onRowClick={ (el) => handleOpenFeedbackMoreInfo(el.row.id) }
                        columns={ userEnhancedFeedbacksDataGrid.columns.map(el => {
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
                            if (el.field === "actions") {
                                return {
                                    ...el,
                                    renderCell: (params) => {
                                        const currentFeedbackInList = 
                                            userFeedbacksData.find(feedback => feedback.id === params.id);
                                        const isAnyChidrenForFeedback = handleCheckIsChildrenExistsForFeedback(Number(params.id));
                                        return (
                                            <div className="callback-edit-icon">
                                                {
                                                    !currentFeedbackInList?.solved ?
                                                    <IconButton 
                                                        className="mui-icon-button"
                                                        onClick={ (e) => {
                                                                e.stopPropagation();
                                                                handleOpenEditFeedbackModal(Number(params.id));
                                                            } 
                                                        }
                                                    >
                                                        <FaRegEdit fontSize={ 25 } />
                                                    </IconButton>
                                                    : null
                                                } 
                                                {
                                                    !currentFeedbackInList?.solved && !isAnyChidrenForFeedback &&
                                                    <IconButton 
                                                        className="mui-icon-button"
                                                        onClick={ (e) => {
                                                                e.stopPropagation();
                                                                handleOpenDeleteFeedbackModal(Number(params.id));
                                                            } 
                                                        }
                                                    >
                                                        <MdDelete fontSize={ 25 } />
                                                    </IconButton>
                                                }
                                                {
                                                    !isAnyChidrenForFeedback ?
                                                        <IconButton 
                                                            className="mui-icon-button"
                                                            onClick={ (e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenRedoFeedbackModal(Number(params.id));
                                                                } 
                                                            }
                                                        >
                                                            <FaRedo fontSize={ 20 } />
                                                        </IconButton> : null
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