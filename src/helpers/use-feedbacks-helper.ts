import { useEffect, useState } from "react";
import $api from "../configs/axiosconfig/axios.js";
import { IFeedBack } from "../interfaces/interfaces.js";
import { IFeedFormData } from "../components/feed-back/feed-back-form/feed-back-form.js";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export const useFeedbacksHelper = (userId: string | null) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [userFeedBacks, setUserFeedbacks] = useState<IFeedBack[]>([]);
    const [userFeedbacksDataGrid, setUserFeedbacksDataGrid] = useState<{ columns: any[], rows: any[]} >({
        columns: [], rows: []
    });
    const [fitleredUserFeedbacksDataGrid, setFilteredUserFeedbacksDataGrid] = useState<{ columns: any[], rows: any[]} >({
        columns: [], rows: []
    });
    const { t } = useTranslation();

    const handleGetFeedbacksDataForDataGrid = (feedbacks: IFeedBack[]) => {
        const rows = feedbacks.map(el => {
            const { id, firstName, secondName, createdAt, typeOfBid, phoneNumber, solved } = el;
            return { id, firstName, secondName, typeOfBid, createdAt, phoneNumber, solved };
        });
        const columns: GridColDef<(typeof rows)[number]>[] = [
            { field: "id", headerName: "ID", minWidth: 50, headerAlign: "center" },
            { field: "firstName", headerName: t("text.firstName"), minWidth: 50, headerAlign: "center" },
            { field: "secondName", headerName: t("text.secondName"), minWidth: 50, headerAlign: "center" },
            { field: "createdAt", headerName: t("text.dateOfCreation"), flex: 1, headerAlign: "center" },
            { field: "phoneNumber", headerName: t("text.phoneNumber"), flex: 1, headerAlign: "center" },
            { field: "typeOfBid", headerName: t("text.typeOfBid"), minWidth: 50, headerAlign: "center" },
            { field: "solved", headerName: t("text.status"), flex: 1, headerAlign: "center" }
        ];
        return { columns, rows };
    };

    const handleFilterUserFeedbacksDataGridByStatus = (isSolved: boolean) => {
        setFilteredUserFeedbacksDataGrid(() => {
            return {
                ...userFeedbacksDataGrid,
                rows: userFeedbacksDataGrid.rows.filter(el => el.solved === isSolved)
            };
        });
    };

    const handleCreateNewUserFeedBack = (feedBackFormData: IFeedFormData) => {
        const dateNow = new Date();
        const dateOfCreation = 
            `${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes()}`;
        if (userId) {
            const newUserFeedback: IFeedBack = {
                ...feedBackFormData,
                id: Date.now(),
                userId: Number(userId),
                solved: false,
                moderatorAnswer: null,
                createdAt: dateOfCreation,
                dateOfAnswer: null
            };
            const updatedFeedbacks = [...userFeedBacks, newUserFeedback];
            setUserFeedbacks(updatedFeedbacks);
            setUserFeedbacksDataGrid(handleGetFeedbacksDataForDataGrid(updatedFeedbacks));
        }
    };
    
    const handleUpdateFeedbackData = (updatedFeedback: IFeedBack) => {
        const updatedFeedbacks = userFeedBacks.map(el => el.id === updatedFeedback.id ? updatedFeedback : el);
        const feedbackDataForGrid = handleGetFeedbacksDataForDataGrid(updatedFeedbacks);
        const filteredFeedbackDataForGrid = handleGetFeedbacksDataForDataGrid(updatedFeedbacks);
        setUserFeedbacks(updatedFeedbacks);
        setUserFeedbacksDataGrid(feedbackDataForGrid);
        setFilteredUserFeedbacksDataGrid(filteredFeedbackDataForGrid);
    };

    const handleSearchFeedbacksByAllFields = (feedbacks: IFeedBack[], value: string) => {
        if (value.length === 0) {
            const feedbacksForDataGrid = handleGetFeedbacksDataForDataGrid(feedbacks);
            setFilteredUserFeedbacksDataGrid(feedbacksForDataGrid);
            return;
        }
        if (value.length < import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH) {
            return;
        }
        const searchValue = value.toLowerCase();
        const findedFeedbacks = feedbacks.filter(feedback => {
            return feedback.description.includes(searchValue) ||
                feedback.email.toLowerCase().includes(searchValue) ||
                feedback.firstName.toLowerCase().includes(searchValue) ||
                feedback.secondName.toLowerCase().includes(searchValue) ||
                feedback.phoneNumber.toLowerCase().includes(searchValue) ||
                feedback.typeOfBid.toLowerCase().includes(searchValue);
        });
        const findedFeedbacksForDataGrid = handleGetFeedbacksDataForDataGrid(findedFeedbacks);
        setFilteredUserFeedbacksDataGrid(findedFeedbacksForDataGrid);
        return findedFeedbacks;
    };

    const handleDeleteFeedbackById = (feedback: IFeedBack) => {
        $api.delete(`/feedbacks?feedbackId=${feedback.id}`)
            .then(res => {
                if (res.data.feedbackId) {
                    const updatedFeedbacks = userFeedBacks.filter(el => el.id !== feedback.id);
                    setUserFeedbacks(updatedFeedbacks);
                    setUserFeedbacksDataGrid(handleGetFeedbacksDataForDataGrid(updatedFeedbacks));
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        const userIdQuery = userId ? Number(userId) : null;
        $api.get(`/feedbacks?userId=${userIdQuery}`)
            .then(res => {
                if (res.data.feedbacks) {
                    const feedbackDataForGrid = handleGetFeedbacksDataForDataGrid(res.data.feedbacks);
                    setUserFeedbacks(res.data.feedbacks);
                    setUserFeedbacksDataGrid(feedbackDataForGrid);
                    setFilteredUserFeedbacksDataGrid(feedbackDataForGrid);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [userId]);

    return {
        loading,
        feedbacks: userFeedBacks,
        feedbacksDataGrid: userFeedbacksDataGrid,
        fitleredFeedbacksDataGrid: fitleredUserFeedbacksDataGrid,
        handleCreateNewUserFeedBack,
        handleUpdateFeedbackData,
        handleFilterUserFeedbacksDataGridByStatus,
        handleSearchFeedbacksByAllFields,
        handleDeleteFeedbackById
    };
};
