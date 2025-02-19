import { useState, useMemo, useEffect } from "react";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getStaticPageInfo } from "../../../../../../models/static-page-generator/static-page-generator-api";
import { INewStaticPageInfo, IStaticPageInfo } from "../../../../../../models/static-page-generator/static-page-generator";
import { CUSTOM_JODIT_TRANSLATIONS } from "./custom.i18n.translations";
import { MdOutlineClose } from "react-icons/md";
import JoditEditor from "jodit-react";
import "./jodit-wysiwyg-editor.scss";


export default function JeditWysiwygEditor({
    currentStaticPages,
    handleCreateNewStaticPage,
    handleUpdateStaticPage
}: {
    currentStaticPages: IStaticPageInfo[],
    handleCreateNewStaticPage: (newPageData: INewStaticPageInfo) => void
    handleUpdateStaticPage: (selectedPage: IStaticPageInfo) => void
}) {

    const [content, setContent] = useState<string>(``);
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
    const [selectedPage, setSelectedPage] = useState<IStaticPageInfo | null>(null);
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const config = useMemo(() => ({
        language: currentLanguage,
        i18n: CUSTOM_JODIT_TRANSLATIONS,
        readonly: false,
        height: 600,
        placeholder: "",
        removeButtons: ["source", "preview"],
    }), []);
    
    const handleOnChange = (content: string) => {
        setContent(content);
    };

    const handleSaveNewPageData = () => {
        if (selectedPage) {
            handleUpdateStaticPage({
                ...selectedPage,
                content: content
            });
        } else {
            handleCreateNewStaticPage({
                title: "",
                description: "",
                menuTitle: "",
                content,
                isPublished: false
            });
        }
    };

    const handleUpdateSelectedPage = (id: number | null) => {
        if (id) {
            getStaticPageInfo(id)
                .then(res => {
                    if(res.data.page) {
                        setSelectedPage(res.data.page);
                        setContent(res.data.page.content);
                    }
                });
        } else {
            setSelectedPage(null);
            setContent("");
        }
    };

    useEffect(() => {
        if (isPreviewOpen) {
            window.scrollTo(0, 0);
        }
    }, [isPreviewOpen]);

    useEffect(() => {
        setSelectedPage(() => {
            const updatedSelectedPage = currentStaticPages.find(el => el.id === selectedPage?.id) || null;
            return updatedSelectedPage;
        });
    }, [currentStaticPages]);

    return (
        <div className="jodit-wysiwyg-editor">
            <div className="jodit-wysiwyg-editor-title">
                { t("text.managingStaticPages") }
            </div>
            <div className="jodit-wysiwyg-editor-header">
                <div className="jodit-wysiwyg-editor-header-main">
                    <Autocomplete
                        value={ 
                            selectedPage 
                                ? { id: selectedPage.id, label: selectedPage.title }
                                : null
                        }
                        options={ currentStaticPages.map(el => {
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
                        { t("text.previewPage") }
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
                <>
                    <div 
                        dangerouslySetInnerHTML={ { __html: content } }
                        className="jodit-wysiwyg jodit-editor-preview"
                    >
                    </div>
                    <IconButton
                        className="jodit-editor-preview-close"
                        onClick={ () => setIsPreviewOpen(false) }
                    >
                        <MdOutlineClose  fontSize={ 25 } />
                    </IconButton>
                </>
            }
        </div>
    );
}