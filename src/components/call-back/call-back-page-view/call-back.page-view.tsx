import { useTranslation } from "react-i18next";
import CallBackForm from "../call-back-form/call-back-form";
import "./call-back-page-view.scss";
import { ICallBack } from "../../../interfaces/interfaces";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BsFillInfoSquareFill } from "react-icons/bs";

interface ICallBackPageViewProps {
    userCallbacksData: ICallBack[],
    handleOpenCallbackMoreInfo: (callback: ICallBack) => void
}

export default function CallBackPageView({ 
    userCallbacksData,
    handleOpenCallbackMoreInfo
}: ICallBackPageViewProps) {

    const { t } = useTranslation();

    return (
        <div className="call-back-page">
            <div className="title">{ t("text.yourActiveCallbacks") }</div>
            <div className="content">
                { userCallbacksData.length === 0 
                    ? <span className="helper-text">{ t("text.youHaveNoCallbacksYet") }</span>
                    : 
                    <TableContainer>
                        <Table className="call-back-table">
                            <TableHead className="call-back-table-header">
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Имя</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Дата заявки</TableCell>
                                    <TableCell>Номер</TableCell>
                                    <TableCell>Статус</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    userCallbacksData.map(callback => {
                                        return (
                                            <TableRow 
                                                className="call-back-block" 
                                                key={ callback.id }
                                                onClick={ () => handleOpenCallbackMoreInfo(callback) }
                                            >
                                                <TableCell className="id">
                                                    ID: { callback.id }
                                                </TableCell>
                                                <TableCell className="name">
                                                    { callback.firstName } { callback.secondName }
                                                </TableCell>
                                                <TableCell className="email">
                                                    { callback.email }
                                                </TableCell>
                                                <TableCell className="date-of-creation">
                                                    { callback.dateOfCreation }
                                                </TableCell>
                                                <TableCell className="phone">
                                                    { callback.phoneNumber }
                                                </TableCell>
                                                <TableCell className="status">
                                                    { callback.solved 
                                                        ? <span className="success-text">{ t("text.solved") }</span> 
                                                        : <span className="waiting-text">{ t("text.waiting") }</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="actions">
                                                    <IconButton 
                                                        className="icon-action"
                                                        onClick={ () => handleOpenCallbackMoreInfo(callback) }
                                                    >
                                                        <BsFillInfoSquareFill />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </div>
        </div>
    );
}