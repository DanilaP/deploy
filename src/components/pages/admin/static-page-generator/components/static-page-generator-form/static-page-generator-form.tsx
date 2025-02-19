import { Button, Checkbox, FormControl, FormLabel, TextField } from "@mui/material";
import { INewStaticPageInfo, IStaticPageInfo } from "../../../../../../models/static-page-generator/static-page-generator";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { validateRequiredField } from "../../../../../../helpers/validators/validators-helper";
import "./static-page-generator-form.scss";

interface IStaticManageFormData {
    id?: number,
    title: string,
    menuTitle: string,
    content: string,
    isPublished: boolean,
    description: string
}

interface IComponentProps {
    staticPageInfo: INewStaticPageInfo | IStaticPageInfo,
    handleCloseModal: () => void,
    handleUpdateStaticPageInfo: (newStaticPageData: IStaticPageInfo) => void,
    handleCreateStaticPageInfo: (newStaticPage: IStaticPageInfo) => void,
}

export default function StaticPageGeneratorForm({
    staticPageInfo,
    handleCloseModal,
    handleUpdateStaticPageInfo,
    handleCreateStaticPageInfo
}: IComponentProps) {

    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IStaticManageFormData>({
        defaultValues: staticPageInfo
    });

    const handleUpdateStaticPageData = (data: IStaticManageFormData) => {
        if (data.id) {
            handleUpdateStaticPageInfo(data);
            handleCloseModal();
        } else {
            handleCreateStaticPageInfo(data);
        }
    };

    return (
        <form 
            onSubmit={ handleSubmit(handleUpdateStaticPageData) } 
            className="static-page-manage-form"
        >
            <FormControl className="static-page-form-field">
                <FormLabel>
                    { t("text.title") }
                </FormLabel>
                <TextField
                    { ...register("title", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                    helperText={ errors.title?.message }
                    error={ Boolean(errors.title) }
                    placeholder={ t("text.title") }
                />
            </FormControl>
            <FormControl className="static-page-form-field">
                <FormLabel>
                    { t("text.menuTitle") }
                </FormLabel>
                <TextField
                    { ...register("menuTitle", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                    helperText={ errors.menuTitle?.message }
                    error={ Boolean(errors.menuTitle) }
                    placeholder={ t("text.menuTitle") }
                />
            </FormControl>
            <FormControl className="static-page-form-field">
                <FormLabel>
                    { t("text.description") }
                </FormLabel>
                <TextField
                    { ...register("description", {
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                    helperText={ errors.description?.message }
                    error={ Boolean(errors.description) }
                    placeholder={ t("text.description") }
                />
            </FormControl>
            <FormControl className="static-page-checkbox-field">
                <Checkbox
                    { ...register("isPublished") }
                />
                <FormLabel>
                    { t("text.publish") }
                </FormLabel>  
            </FormControl>
            <div className="form-actions">
                <Button
                    variant="contained"
                    type="submit"
                >
                    { t("text.save") }
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={ handleCloseModal }
                >
                    { t("text.cancel") }
                </Button>
            </div>
        </form>
    );
}