import { useEffect, useState } from "react";
import $api from "../configs/axiosconfig/axios.js";
import { ICallBack } from "../interfaces/interfaces.js";
import { ICallFormData } from "../components/call-back/call-back-form/call-back-form.js";

export const useCallbacksHelper = (userId: string | null) => {

    const [userCallBacks, setUserCallbacks] = useState<ICallBack[]>([]);

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

    return { 
        userCallBacks, 
        handleCreateNewUserCallBack 
    };
};
