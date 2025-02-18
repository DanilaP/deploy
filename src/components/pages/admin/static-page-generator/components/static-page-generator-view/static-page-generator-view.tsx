import { lazy } from "react";
import "./static-page-generator-view.scss";
const JeditWysiwygEditor = lazy(() => import("../../../../../partials/jodit-wysiwyg-editor/jodit-wysiwyg-editor"));

interface IStaticPageGeneratorPageViewProps {
    
}

export default function StaticPageGeneratorPageView(props: IStaticPageGeneratorPageViewProps) {
    return (
        <div className="static-page-generator-page-view">
            <JeditWysiwygEditor />
        </div>
    );
}