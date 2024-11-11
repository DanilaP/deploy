import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import "./providersPageView.scss";
import { IProvider } from "../../../../interfaces/interfaces";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import CustomModal from "../../../../components-ui/custom-modal/custom-modal";
import { useTranslation } from "react-i18next";
import ProvidersManageForm from "../providers-manage-form/providersManageForm";
import { IoMdSearch } from "react-icons/io";
import { DEFAULT_PROVIDER } from "../constants";

interface IProvidersPageViewProps {
    providers: IProvider[],
    modals: { manage: boolean, deleteConfirmation: boolean },
    choosedProvider: IProvider,
    handleDeleteProvider: () => void,
    handleOnOpenDeletingProviderModal: (provider: IProvider) => void,
    handleOnCloseDeletingProviderModal: () => void,
    handleOnOpenManageProviderModal: (provider: IProvider) => void,
    handleOnCloseManageProviderModal: () => void,
    handleOnUpdateProvider: (provider: IProvider) => void,
    handleOnCreateProvider: (provider: IProvider) => void
}

export default function ProvidersPageView({
    providers,
    modals,
    choosedProvider,
    handleDeleteProvider,
    handleOnOpenDeletingProviderModal,
    handleOnCloseDeletingProviderModal,
    handleOnOpenManageProviderModal,
    handleOnCloseManageProviderModal,
    handleOnUpdateProvider,
    handleOnCreateProvider
}: IProvidersPageViewProps) {

    const { t } = useTranslation();

    return (
        <div className="providers-page-view">
            <div className="title">{ t("text.managingProviders") }</div>
            <div className="actions">
                <div className="search">
                    <TextField
                        onChange={ (e) => console.log(e) } 
                        placeholder={ t("text.searchAll") }
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                </div>
                <div className="buttons">
                    <Button
                        variant='contained'
                        onClick={ () => handleOnOpenManageProviderModal(DEFAULT_PROVIDER) }
                    >{ t("text.createProvider") }</Button>
                </div>
            </div>
            <div className="content">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Дата добавления</TableCell>
                                <TableCell>Описание</TableCell>
                                <TableCell>Контактное лицо</TableCell>
                                <TableCell>Сайт</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Изменить</TableCell>
                                <TableCell>Удалить</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                providers.map(el => {
                                    return (
                                        <TableRow className="provider-row" key={ el.id }>
                                            <TableCell>{ el.id }</TableCell>
                                            <TableCell>{ el.name }</TableCell>
                                            <TableCell>{ el.dateOfCreation }</TableCell>
                                            <TableCell>{ el.description }</TableCell>
                                            <TableCell>{ el.contactPerson.name }</TableCell>
                                            <TableCell>
                                                <a href={ el.website } target="__blank">Посетить сайт</a>
                                            </TableCell>
                                            <TableCell className="provider-status">
                                                { el.active 
                                                    ? <div className="provider-active"></div>
                                                    : <div className="provider-inactive"></div>
                                                }
                                            </TableCell>
                                            <TableCell className="provider-actions">
                                                <IconButton 
                                                    className="mui-actions"
                                                    onClick={ () => handleOnOpenManageProviderModal(el) }
                                                >
                                                    <FaEdit />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell className="provider-actions">
                                                <IconButton
                                                    className="mui-actions"
                                                    onClick={ () => handleOnOpenDeletingProviderModal(el) }
                                                >
                                                    <MdDelete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <CustomModal 
                isDisplay={ modals.deleteConfirmation }
                title={ t("text.approveAction") }
                typeOfActions='default'
                actionConfirmed={ handleDeleteProvider }
                closeModal={ () => handleOnCloseDeletingProviderModal() }
            >
                <div className="delete-text">{ t("text.approveDeletingProvider") }?</div>
            </CustomModal>
            <CustomModal 
                isDisplay={ modals.manage }
                title={ choosedProvider.id ? t("text.editProvider") : t("text.createProvider") }
                typeOfActions='none'
                actionConfirmed={ handleOnCloseManageProviderModal }
                closeModal={ handleOnCloseManageProviderModal }
            >
                <ProvidersManageForm
                    choosedProvider={ choosedProvider }
                    handleCancelManaging={ handleOnCloseManageProviderModal }
                    handleOnUpdateProvider={ handleOnUpdateProvider }
                    handleOnCreateProvider={ handleOnCreateProvider }
                />
            </CustomModal>
        </div>
    );
}