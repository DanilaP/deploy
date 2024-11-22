import { 
    Button, 
    IconButton, 
    MenuItem, 
    Select, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField 
} from "@mui/material";
import { IProvider } from "../../../../interfaces/interfaces";
import { MdDelete } from "react-icons/md";
import { FaEdit, FaTrashRestoreAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { IoMdSearch } from "react-icons/io";
import { DEFAULT_PROVIDER } from "../constants";
import ProvidersManageForm from "../providers-manage-form/providersManageForm";
import CustomModal from "../../../../components-ui/custom-modal/custom-modal";
import "./providersPageView.scss";

interface IProvidersPageViewProps {
    providers: IProvider[],
    modals: { manage: boolean, deleteConfirmation: boolean, unsavedData: boolean, restoreConfirmation: boolean },
    choosedProvider: IProvider,
    currentActiveFilter: number,
    handleSearchProvidersByAllFields: (value: string) => void,
    handleDeleteProvider: () => void,
    handleOnRestoreProviderModal: (e: any, provider: IProvider) => void,
    handleOnOpenDeletingProviderModal: (e: any, provider: IProvider) => void,
    handleOnCloseDeletingProviderModal: () => void,
    handleOnOpenManageProviderModal: (provider: IProvider) => void,
    handleOnCloseManageProviderModal: () => void,
    handleOnUpdateProvider: (provider: IProvider) => void,
    handleOnCreateProvider: (provider: IProvider) => void,
    handleSetUnsavedChangesExist: (status: boolean) => void,
    handleCloseUnsavedDataModal: () => void,
    handleCloseManageModalWithUnSavedData: () => void,
    handleSearchProvidersByTypes: (type: number) => void,
    handleOnCloseRestoreProviderModal: () => void,
    handleRestoreProvider: () => void
}

export default function ProvidersPageView({
    providers,
    modals,
    choosedProvider,
    currentActiveFilter,
    handleSearchProvidersByAllFields,
    handleDeleteProvider,
    handleOnOpenDeletingProviderModal,
    handleOnCloseDeletingProviderModal,
    handleOnOpenManageProviderModal,
    handleOnCloseManageProviderModal,
    handleOnUpdateProvider,
    handleOnRestoreProviderModal,
    handleOnCreateProvider,
    handleSetUnsavedChangesExist,
    handleCloseUnsavedDataModal,
    handleCloseManageModalWithUnSavedData,
    handleSearchProvidersByTypes,
    handleOnCloseRestoreProviderModal,
    handleRestoreProvider
}: IProvidersPageViewProps) {

    const { t } = useTranslation();

    return (
        <div className="providers-page-view">
            <div className="title">{ t("text.managingProviders") }</div>
            <div className="actions">
                <div className="search">
                    <TextField
                        onChange={ (e) => handleSearchProvidersByAllFields(e.target.value) } 
                        placeholder={ t("text.searchAll") }
                        InputProps={ {
                            startAdornment: (
                                <IoMdSearch fontSize={ 25 } />
                            ),
                        } }
                    />
                    <Select
                        className="provider-active-filter"
                        onChange={ (e) => handleSearchProvidersByTypes(Number(e.target.value)) }
                        defaultValue={ 1 }
                    >
                        <MenuItem value={ 1 }>{ t("text.active") }</MenuItem>
                        <MenuItem value={ 0 }>{ t("text.inactive") }</MenuItem>
                        <MenuItem value={ 2 }>{ t("text.deleted") }</MenuItem>
                    </Select>
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
                            <TableRow className="provider-row">
                                <TableCell>ID</TableCell>
                                <TableCell>{ t("text.name") }</TableCell>
                                <TableCell>{ t("text.dateOfCreation") }</TableCell>
                                <TableCell>{ t("text.description") }</TableCell>
                                <TableCell>{ t("text.contactPerson") }</TableCell>
                                <TableCell>{ t("text.website") }</TableCell>
                                <TableCell>{ t("text.status") }</TableCell>
                                <TableCell>{ t("text.edit") }</TableCell>
                                <TableCell>
                                    { currentActiveFilter === 2
                                       ? t("text.restore") 
                                       : t("text.delete") 
                                    }
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                providers.map(el => {
                                    return (
                                        <TableRow 
                                            className="provider-row" 
                                            key={ el.id }
                                            onClick={ () => handleOnOpenManageProviderModal(el) }
                                        >
                                            <TableCell>{ el.id }</TableCell>
                                            <TableCell>{ el.name }</TableCell>
                                            <TableCell>{ el.dateOfCreation }</TableCell>
                                            <TableCell>{ el.description }</TableCell>
                                            <TableCell>{ el.contactPerson.name }</TableCell>
                                            <TableCell>
                                                <a 
                                                    href={ el.website } 
                                                    target="__blank"
                                                    className="provider-visit-website"
                                                    onClick={ e => e.stopPropagation() }
                                                >{ t("text.visitWebsite") }</a>
                                            </TableCell>
                                            <TableCell className="provider-status">
                                                { el.active 
                                                    ? <div className="provider-active">{ t("text.active") }</div>
                                                    : <div className="provider-inactive">{ t("text.inActive") }</div>
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
                                                    onClick={ (e: any) => {
                                                        currentActiveFilter !== 2
                                                            ? handleOnOpenDeletingProviderModal(e, el)
                                                            : handleOnRestoreProviderModal(e, el);
                                                    } }
                                                >
                                                    { currentActiveFilter === 2
                                                        ? <FaTrashRestoreAlt fontSize={ 20 } />
                                                        : <MdDelete fontSize={ 25 } />
                                                    }
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
                isHidden={ modals.unsavedData }
                isDisplay={ modals.manage }
                title={ choosedProvider.id ? t("text.editProvider") : t("text.createProvider") }
                typeOfActions='none'
                actionConfirmed={ handleOnCloseManageProviderModal }
                closeModal={ handleOnCloseManageProviderModal }
            >
                <ProvidersManageForm
                    choosedProvider={ choosedProvider }
                    handleSetUnsavedChangesExist={ handleSetUnsavedChangesExist }
                    handleCancelManaging={ handleOnCloseManageProviderModal }
                    handleOnUpdateProvider={ handleOnUpdateProvider }
                    handleOnCreateProvider={ handleOnCreateProvider }
                />
            </CustomModal>
            <CustomModal
                isDisplay={ modals.unsavedData }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ handleCloseManageModalWithUnSavedData }
                closeModal={ handleCloseUnsavedDataModal }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ handleCloseManageModalWithUnSavedData }
                        >{ t("text.close") }</Button>
                        <Button
                            onClick={ handleCloseUnsavedDataModal }
                            variant="contained"
                        >{ t("text.cancel") }</Button>
                    </>
                }
            >
                <div className="delete-text">{ t("text.unsavedChanges") }?</div>
            </CustomModal>
            <CustomModal
                isDisplay={ modals.restoreConfirmation }
                title={ t("text.approveAction") }
                typeOfActions='custom'
                actionConfirmed={ handleOnCloseRestoreProviderModal }
                closeModal={ handleOnCloseRestoreProviderModal }
                actionsComponent={
                    <>
                        <Button 
                            variant="contained"
                            onClick={ handleRestoreProvider }
                        >{ t("text.confirm") }</Button>
                        <Button
                            onClick={ handleOnCloseRestoreProviderModal }
                            variant="contained"
                        >{ t("text.cancel") }</Button>
                    </>
                }
            >
                <div className="delete-text">{ t("text.restoreProvider") }?</div>
            </CustomModal>
        </div>
    );
}