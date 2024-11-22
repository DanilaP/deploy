import { useEffect, useState } from "react";
import $api from "../configs/axiosconfig/axios.js";
import { ICallBack } from "../interfaces/interfaces.js";
import { ICallFormData } from "../components/call-back/call-back-form/call-back-form.js";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export const useCallbacksHelper = (userId: string | null) => {

    const [userCallBacks, setUserCallbacks] = useState<ICallBack[]>([]);
    const [userCallbacksDataGrid, setUserCallbacksDataGrid] = useState<{ columns: any[], rows: any[]} >({
        columns: [], rows: []
    });
    const { t } = useTranslation();

    const handleSetCallbacksDataForDataGrid = (callbacks: ICallBack[]) => {
        const rows = callbacks.map(el => {
            const { id, firstName, secondName, dateOfCreation, phoneNumber, solved } = el;
            return { id, firstName, secondName, dateOfCreation, phoneNumber, solved };
        });
        const columns: GridColDef<(typeof rows)[number]>[] = [
            { field: "id", headerName: "ID", flex: 1 },
            { field: "firstName", headerName: t("text.firstName"), flex: 1 },
            { field: "secondName", headerName: t("text.secondName"), flex: 1 },
            { field: "dateOfCreation", headerName: t("text.dateOfCreation"), flex: 1 },
            { field: "phoneNumber", headerName: t("text.phoneNumber"), flex: 1 },
            { field: "solved", headerName: t("text.status"), flex: 1 }
        ];
        
        setUserCallbacksDataGrid({ columns, rows });
    };

    const handleCreateNewUserCallBack = (callBackFormData: ICallFormData) => {
        const dateNow = new Date();
        const dateOfCreation = `${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}`;
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
            setUserCallbacks((prev) => [...prev, newUserCallback]);
        }
    };

    useEffect(() => {
        if (userId) {
            $api.get(`/callbacks?userId=${Number(userId)}`)
            .then(res => {
                if (res.data.callbacks) {
                    setUserCallbacks(res.data.callbacks);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }, [userId]);

    useEffect(() => {
        handleSetCallbacksDataForDataGrid(userCallBacks);
    }, [userCallBacks]);

    return { 
        userCallBacks,
        userCallbacksDataGrid,
        handleCreateNewUserCallBack
    };
};
