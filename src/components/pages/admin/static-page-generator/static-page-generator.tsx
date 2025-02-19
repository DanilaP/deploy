import { useEffect, useState } from "react";
import { INewStaticPageInfo, IStaticPageInfo } from "../../../../models/static-page-generator/static-page-generator";
import StaticPageGeneratorPageView from "./components/static-page-generator-view/static-page-generator-view";
import { getStaticPagesInfo, saveStaticPageInfo } from "../../../../models/static-page-generator/static-page-generator-api";

export default function StaticPageGeneratorPage() {

    const [modals, setModals] = useState({ manage: false });
    const [staticPageInfo, setStaticPageInfo] = useState<IStaticPageInfo | INewStaticPageInfo>({} as INewStaticPageInfo);
    const [currentStaticPages, setCurrentStaticPages] = useState<IStaticPageInfo[]>([]);

    const handleCreateNewStaticPage = (newPageData: INewStaticPageInfo) => {
        setStaticPageInfo(newPageData);
        handleOpenManagePageModal();
    };

    const handleUpdateStaticPage = (selectedPage: IStaticPageInfo) => {
        setStaticPageInfo(selectedPage);
        handleOpenManagePageModal();
    };

    const handleOpenManagePageModal = () => {
        setModals((prev) => {
            return { ...prev, manage: true };
        });
    };

    const handleCloseManagePageModal = () => {
        setModals((prev) => {
            return { ...prev, manage: false };
        });
    };

    const handleUpdateStaticPageInfo = (newStaticPageData: IStaticPageInfo) => {
        saveStaticPageInfo(newStaticPageData).then(res => {
            if (res.data.pages) {
                setCurrentStaticPages(res.data.pages);
            }
        });
    };

    const handleCreateStaticPageInfo = (newStaticPage: INewStaticPageInfo) => {
        console.log(newStaticPage);
    };

    useEffect(() => {
        getStaticPagesInfo().then(res => {
            if (res.data.pages) {
                setCurrentStaticPages(res.data.pages);
            }
        });
    }, []);

    return (
        <StaticPageGeneratorPageView
            modals={ modals }
            staticPageInfo={ staticPageInfo }
            currentStaticPages={ currentStaticPages }
            handleUpdateStaticPageInfo={ handleUpdateStaticPageInfo }
            handleCreateNewStaticPage={ handleCreateNewStaticPage }
            handleUpdateStaticPage={ handleUpdateStaticPage }
            handleCloseManagePageModal={ handleCloseManagePageModal }
            handleCreateStaticPageInfo={ handleCreateStaticPageInfo }
        />
    );
}