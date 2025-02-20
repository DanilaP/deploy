import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStaticPageInfo } from "../../../models/static-page-generator/static-page-generator-api";
import { IStaticPageInfo } from "../../../models/static-page-generator/static-page-generator";
import StaticPageView from "./static-page-view/static-page-view";
import Loader from "../../partials/loader/loader";

export default function StaticPage() {

    const params = useParams();
    const [staticPage, setStaticPage] = useState<IStaticPageInfo | null>(null);

    useEffect(() => {
        if (params.id) {
            getStaticPageInfo(Number(params.id))
                .then(res => {
                    if (res.data.page && res.data.page.isPublished) {
                        setStaticPage(res.data.page);
                        document.title = res.data.page.title;
                    }
                });
        }
    }, [params.id]);

    if (staticPage) {
        return (
            <StaticPageView staticPage={ staticPage } />
        );
    } else {
        return (
            <Loader />
        );
    }
}