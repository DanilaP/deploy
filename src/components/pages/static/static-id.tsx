import { IStaticPageInfo } from "../../../models/static-page-generator/static-page-generator";
import StaticPageView from "./static-page-view/static-page-view";

export default function StaticPage({ data }: { data: IStaticPageInfo }) {

    if (data) {
        return (
            <StaticPageView staticPage={ data } />
        );
    }
}

