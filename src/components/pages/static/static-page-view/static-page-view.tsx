
import React from "react";
import { IStaticPageInfo } from "../../../../models/static-page-generator/static-page-generator";
import "./static-page-view.scss";

const JoditEditor = React.lazy(() => import("jodit-react"));

interface IStaticPageViewProps {
    staticPage: IStaticPageInfo
}

export default function StaticPageView({ staticPage }: IStaticPageViewProps) {
    return (
        <div className="static-page-view">
            <div className="static-page-view-hidden-editor">
                <JoditEditor />
            </div>
            <div 
                dangerouslySetInnerHTML={ { __html: staticPage.content } }
                className="jodit-wysiwyg"
            >    
            </div>
        </div>
    );
}