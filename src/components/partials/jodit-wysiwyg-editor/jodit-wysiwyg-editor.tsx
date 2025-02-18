import { useState, useMemo, useEffect } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getStaticPageInfo, getStaticPagesInfo } from "../../../models/static-page-generator/static-page-generator-api";
import { IStaticPageInfo } from "../../../models/static-page-generator/static-page-generator";
import JoditEditor from "jodit-react";
import "./jodit-wysiwyg-editor.scss";

export default function JeditWysiwygEditor() {

    const [content, setContent] = useState(``);
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [selectedPage, setSelectedPage] = useState<IStaticPageInfo | null>(null);
    const [pagesList, setPagesList] = useState<IStaticPageInfo[]>([]);
    const { t } = useTranslation();

    const config = useMemo(() => ({
        readonly: false,
        height: 300,
        removeButtons: ["source"]
    }),[]);
    
    const handleOnChange = (content: string) => {
        setContent(content);
    };

    const handleSaveNewPageData = () => {
        console.log(`
            ${selectedPage},
            ${content}
        `);  
    };

    const handleUpdateSelectedPage = (id: number | null) => {
        if (id) {
            getStaticPageInfo(id)
                .then(res => {
                    if(res.data.page) {
                        setSelectedPage(res.data.page);
                    }
                });
        }
    };

    useEffect(() => {
        getStaticPagesInfo().then(res => {
            if (res.data.pages) {
                setPagesList(res.data.pages);
            }
        });
    }, []);

    return (
        <div className="jodit-wysiwyg-editor">
            <div className="jodit-wysiwyg-editor-title">
                Управление статическими страницами
            </div>
            <div className="jodit-wysiwyg-editor-header">
                <div className="jodit-wysiwyg-editor-header-main">
                    <Autocomplete
                        options={ pagesList.map(el => {
                            return { id: el.id, label: el.title };
                        }) }
                        onChange={ (_, value) => handleUpdateSelectedPage(value?.id || null) }
                        renderInput={ (params) => (
                            <TextField
                                placeholder={ t("text.search") }
                                { ...params }
                            />
                        ) }
                    />
                    <Button 
                        variant="contained" 
                        onClick={ () => setIsPreviewOpen(true) }
                    >
                        Превью страницы
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={ () => setIsPreviewOpen(false) }
                    >
                        Редактор страницы
                    </Button>
                </div>
                <div className="jodit-wysiwyg-editor-header-actions">
                    <Button 
                        variant="contained" 
                        onClick={ handleSaveNewPageData }
                    >
                        { t("text.save") }
                    </Button> 
                </div>
            </div>
            {
                !isPreviewOpen
                ? <JoditEditor
                    value={ content }
                    config={ config }
                    tabIndex={ 1 }
                    onChange={ handleOnChange }
                />
                :
                <div 
                    dangerouslySetInnerHTML={ { __html: content } }
                    className="jodit-wysiwyg-editor-preview"
                >
                </div>
            }
        </div>
    );
}