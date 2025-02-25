import { useEffect, useState } from "react";
import { IStaticPageInfo } from "../../../models/static-page-generator/static-page-generator";
import { IPrefetchedData } from "../../../interfaces/interfaces";
import { useParams } from "react-router";
import { getStaticPageInfo } from "../../../models/static-page-generator/static-page-generator-api";
import StaticPageView from "./static-page-view/static-page-view";

interface IStaticPageContent {
    content: {
        page: IStaticPageInfo
    }
}
interface IStaticPageProps {
    data: IPrefetchedData<IStaticPageContent>
}

export default function StaticPage({ data }: IStaticPageProps) {

    const [pageContent, setPageContent] = useState<IStaticPageInfo | null>(data ? data.ssrData.content.page : null);
    const searchParams = useParams();

    useEffect(() => {
        if ((!data || data.url !== window.location.pathname) && searchParams.id) {
            getStaticPageInfo(Number(searchParams.id)).then(res => {
                if (res.data.page) {
                    setPageContent(res.data.page);
                }
            });
        } else {
            setPageContent(data.ssrData.content.page);
        }
    }, [searchParams]);

    if (pageContent) {
        return (
            <StaticPageView staticPage={ pageContent } />
        );
    }
}

