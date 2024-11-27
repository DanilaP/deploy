import { useEffect, useState } from "react";
import $api from "../configs/axiosconfig/axios.js";
import { ICallBack } from "../interfaces/interfaces.js";
import { ICallFormData } from "../components/call-back/call-back-form/call-back-form.js";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export const useCallbacksHelper = (userId: string | null) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [userCallBacks, setUserCallbacks] = useState<ICallBack[]>([]);
    const [userCallbacksDataGrid, setUserCallbacksDataGrid] = useState<{ columns: any[], rows: any[]} >({
        columns: [], rows: []
    });
    const [fitleredUserCallbacksDataGrid, setFilteredUserCallbacksDataGrid] = useState<{ columns: any[], rows: any[]} >({
        columns: [], rows: []
    });
    const { t } = useTranslation();

    const handleGetCallbacksDataForDataGrid = (callbacks: ICallBack[]) => {
        const rows = callbacks.map(el => {
            const { id, firstName, secondName, dateOfCreation, typeOfBid, phoneNumber, solved } = el;
            return { id, firstName, secondName, typeOfBid, dateOfCreation, phoneNumber, solved };
        });
        const columns: GridColDef<(typeof rows)[number]>[] = [
            { field: "id", headerName: "ID", minWidth: 50 },
            { field: "firstName", headerName: t("text.firstName"), minWidth: 50 },
            { field: "secondName", headerName: t("text.secondName"), minWidth: 50 },
            { field: "dateOfCreation", headerName: t("text.dateOfCreation"), flex: 1 },
            { field: "phoneNumber", headerName: t("text.phoneNumber"), flex: 1 },
            { field: "typeOfBid", headerName: t("text.typeOfBid"), minWidth: 50 },
            { field: "solved", headerName: t("text.status"), flex: 1 }
        ];
        return { columns, rows };
    };

    const handleFilterUserCallbacksDataGridByStatus = (isSolved: boolean) => {
        setFilteredUserCallbacksDataGrid(() => {
            return {
                ...userCallbacksDataGrid,
                rows: userCallbacksDataGrid.rows.filter(el => el.solved === isSolved)
            };
        });
    };

    const handleCreateNewUserCallBack = (callBackFormData: ICallFormData) => {
        const dateNow = new Date();
        const dateOfCreation = `${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes()}`;
        if (userId) {
            const newUserCallback: ICallBack = {
                ...callBackFormData,
                id: Date.now(),
                userId: Number(userId),
                solved: false,
                moderatorAnswer: null,
                dateOfCreation: dateOfCreation,
                dateOfAnswer: null
            };
            const updatedCallbaks = [...userCallBacks, newUserCallback];
            setUserCallbacks(updatedCallbaks);
            setUserCallbacksDataGrid(handleGetCallbacksDataForDataGrid(updatedCallbaks));
        }
    };
    
    const handleUpdateCallbackData = (updatedCallback: ICallBack) => {
        const updatedCallbacks = userCallBacks.map(el => el.id === updatedCallback.id ? updatedCallback : el);
        const callbackDataForGrid = handleGetCallbacksDataForDataGrid(updatedCallbacks);
        const filteredCallbackDataForGrid = handleGetCallbacksDataForDataGrid(updatedCallbacks);
        setUserCallbacks(updatedCallbacks);
        setUserCallbacksDataGrid(callbackDataForGrid);
        setFilteredUserCallbacksDataGrid(filteredCallbackDataForGrid);
    };

    const handleSearchCallbacksByAllFields = (callbacks: ICallBack[], value: string) => {
        if (value.length === 0) {
            const callbacksForDataGrid = handleGetCallbacksDataForDataGrid(callbacks);
            setFilteredUserCallbacksDataGrid(callbacksForDataGrid);
            return;
        }
        if (value.length < import.meta.env.VITE_APP_MIN_LENGTH_FOR_SEARCH) {
            return;
        }
        const searchValue = value.toLowerCase();
        const findedCallbacks = callbacks.filter(callback => {
            return callback.description.includes(searchValue) ||
                callback.email.toLowerCase().includes(searchValue) ||
                callback.firstName.toLowerCase().includes(searchValue) ||
                callback.secondName.toLowerCase().includes(searchValue) ||
                callback.phoneNumber.toLowerCase().includes(searchValue) ||
                callback.typeOfBid.toLowerCase().includes(searchValue);
        });
        const findedCallbacksForDataGrid = handleGetCallbacksDataForDataGrid(findedCallbacks);
        setFilteredUserCallbacksDataGrid(findedCallbacksForDataGrid);
        return findedCallbacks;
    };

    useEffect(() => {
        const userIdQuery = userId ? Number(userId) : null;
        $api.get(`/callbacks?userId=${userIdQuery}`)
            .then(res => {
                if (res.data.callbacks) {
                    const callbackDataForGrid = handleGetCallbacksDataForDataGrid(res.data.callbacks);
                    setUserCallbacks(res.data.callbacks);
                    setUserCallbacksDataGrid(callbackDataForGrid);
                    setFilteredUserCallbacksDataGrid(callbackDataForGrid);
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
        callbacks: userCallBacks,
        callbacksDataGrid: userCallbacksDataGrid,
        fitleredCallbacksDataGrid: fitleredUserCallbacksDataGrid,
        handleCreateNewUserCallBack,
        handleUpdateCallbackData,
        handleFilterUserCallbacksDataGridByStatus,
        handleSearchCallbacksByAllFields
    };
};
