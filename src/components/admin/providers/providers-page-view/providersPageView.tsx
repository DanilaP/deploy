import { 
    Button, 
    IconButton, 
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
import { FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { IoMdSearch } from "react-icons/io";
import { DEFAULT_PROVIDER } from "../constants";
import ProvidersManageForm from "../providers-manage-form/providersManageForm";
import CustomModal from "../../../../components-ui/custom-modal/custom-modal";
import "./providersPageView.scss";

interface IProvidersPageViewProps {
    providers: IProvider[],
    modals: { manage: boolean, deleteConfirmation: boolean, unsavedData: boolean },
    choosedProvider: IProvider,
    handleSearchProvidersByAllFields: (value: string) => void,
    handleDeleteProvider: () => void,
    handleOnOpenDeletingProviderModal: (e: any, provider: IProvider) => void,
    handleOnCloseDeletingProviderModal: () => void,
    handleOnOpenManageProviderModal: (provider: IProvider) => void,
    handleOnCloseManageProviderModal: () => void,
    handleOnUpdateProvider: (provider: IProvider) => void,
    handleOnCreateProvider: (provider: IProvider) => void,
    handleSetUnsavedChangesExist: (status: boolean) => void,
    handleCloseUnsavedDataModal: () => void,
    handleCloseManageModalWithUnSavedData: () => void,
}

export default function ProvidersPageView({
    providers,
    modals,
    choosedProvider,
    handleSearchProvidersByAllFields,
    handleDeleteProvider,
    handleOnOpenDeletingProviderModal,
    handleOnCloseDeletingProviderModal,
    handleOnOpenManageProviderModal,
    handleOnCloseManageProviderModal,
    handleOnUpdateProvider,
    handleOnCreateProvider,
    handleSetUnsavedChangesExist,
    handleCloseUnsavedDataModal,
    handleCloseManageModalWithUnSavedData
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
                                <TableCell>{ t("text.delete") }</TableCell>
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
                                                    onClick={ (e: eny) => handleOnOpenDeletingProviderModal(e, el) }
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
                typeOfActions='default'
                actionConfirmed={ handleCloseManageModalWithUnSavedData }
                closeModal={ handleCloseUnsavedDataModal }
            >
                <div className="delete-text">{ t("text.unsavedChanges") }?</div>
            </CustomModal>
        </div>
    );
}