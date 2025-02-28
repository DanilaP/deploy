import { lazy, Suspense } from "react";
import "./static-page-generator-view.scss";
import { INewStaticPageInfo, IStaticPageInfo } from "../../../../../../models/static-page-generator/static-page-generator";
import CustomModal from "../../../../../components-ui/custom-modal/custom-modal";
import { useTranslation } from "react-i18next";
import StaticPageGeneratorForm from "../static-page-generator-form/static-page-generator-form";
const JeditWysiwygEditor = lazy(() => import("../jodit-wysiwyg-editor/jodit-wysiwyg-editor"));

interface IStaticPageGeneratorPageViewProps {
    modals: { manage: boolean },
    staticPageInfo: INewStaticPageInfo | IStaticPageInfo,
    currentStaticPages: IStaticPageInfo[],
    handleCreateNewStaticPage: (newPageData: INewStaticPageInfo) => void,
    handleUpdateStaticPage: (selectedPage: IStaticPageInfo) => void,
    handleCloseManagePageModal: () => void,
    handleUpdateStaticPageInfo: (newStaticPageData: IStaticPageInfo) => void,
    handleCreateStaticPageInfo: (newStaticPage: INewStaticPageInfo) => void,
}

export default function StaticPageGeneratorPageView({
    modals,
    staticPageInfo,
    currentStaticPages,
    handleCreateNewStaticPage,
    handleUpdateStaticPage,
    handleCloseManagePageModal,
    handleUpdateStaticPageInfo,
    handleCreateStaticPageInfo
}: IStaticPageGeneratorPageViewProps) {

    const { t } = useTranslation();

    return (
        <div className="static-page-generator-page-view">
            <Suspense fallback={ <div>Loading...</div> }>
                <JeditWysiwygEditor
                    currentStaticPages={ currentStaticPages }
                    handleUpdateStaticPage={ handleUpdateStaticPage }
                    handleCreateNewStaticPage={ handleCreateNewStaticPage }
                />
            </Suspense>
            <CustomModal
                isDisplay={ modals.manage }
                title={ t("text.manageStaticPageInfo") }
                closeModal={ handleCloseManagePageModal }
                actionConfirmed={ handleCloseManagePageModal }
                typeOfActions="none"
            >
                <StaticPageGeneratorForm
                    staticPageInfo={ staticPageInfo }
                    handleUpdateStaticPageInfo={ handleUpdateStaticPageInfo }
                    handleCloseModal={ handleCloseManagePageModal }
                    handleCreateStaticPageInfo={ handleCreateStaticPageInfo }
                />
            </CustomModal>
        </div>
    );
}