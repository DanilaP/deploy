import { Autocomplete, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { validateEmail, validatePhone, validateRequiredField } from "../../../../../helpers/validators/validators-helper";
import { useEffect, useState } from "react";
import { IAttachment } from "../../../../../interfaces/interfaces";
import { convertFileListToAttachmentsFormatBlobArray } from "../../../../../helpers/convert-file-list-to-blob-array";
import { IFeedBack, IFeedbackType } from "../../../../../models/feedbacks/feedbacks";
import FileAttachment from "../../../../partials/file-attachment/file-attachment";
import InputMask from 'react-input-mask';
import InputFile from "../../../../components-ui/custom-file-nput/file-input";
import "./feed-back-form.scss";
import ReCaptcha from "../../../../partials/re-captcha/re-captcha";

interface IFeedBackFormProps {
    mode: "create" | "edit" | null,
    currentFeedback: IFeedBack | null,
    feedbackForRedo: IFeedBack | null,
    feedbackTypes: IFeedbackType[],
    handleCloseCreatingNewFeedback: () => void,
    handleSaveNewFeedback: (feedback: IFeedFormData) => void,
    handleUpdateUnsavedDataExist: (unsavedDataExists: boolean) => void
    handleEditCurrentFeedback: (feedback: IFeedFormData) => void
}

export interface IFeedFormData {
    firstName: string,
    secondName: string,
    email: string,
    phoneNumber: string,
    description: string,
    typeOfBid: string,
    attachments: IAttachment[],
    parentFeedbackId: number | null
}

export default function FeedBackForm({
    mode,
    currentFeedback,
    feedbackForRedo,
    feedbackTypes,
    handleCloseCreatingNewFeedback,
    handleSaveNewFeedback,
    handleUpdateUnsavedDataExist,
    handleEditCurrentFeedback
}: IFeedBackFormProps) {

    const isEdit = mode === "edit";

    const [isCaptchaPassed, setIsCaptchaPassed] = useState<boolean>(false);

    const { t } = useTranslation();

    const handleGetInithialValuesForForm = () => {
        if (isEdit && currentFeedback) return {
            ...currentFeedback,
            typeOfBid: t(`typesOfFeedbacks.${currentFeedback?.typeOfBid}`)
        };
        if (feedbackForRedo) return {
            firstName: feedbackForRedo?.firstName || "",
            secondName: feedbackForRedo?.secondName || "",
            email: feedbackForRedo?.email || "",
            parentFeedbackId: feedbackForRedo.id
        };
        return { parentFeedbackId: null };
    };

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        control,
        formState: { errors , submitCount, isValid, isDirty },
    } = useForm<IFeedFormData>({
        defaultValues: handleGetInithialValuesForForm()
    });

    const handleCreateNewFeedback = (data: IFeedFormData) => {
        const finalData: IFeedFormData = {
            ...data,
            typeOfBid: feedbackTypes.find(el => t(`typesOfFeedbacks.${el.systemKey}`) === data.typeOfBid)?.systemKey || ""
        };
        if (isEdit) {
            handleEditCurrentFeedback(finalData);
        } else {
            handleSaveNewFeedback(finalData);
        }
    };

    const handleGetSubmitButtonDisabled = () => {
        if (isEdit || feedbackForRedo) {
            return !isValid || !isCaptchaPassed;
        } else {
            return submitCount !== 0 && (!isValid || !isCaptchaPassed);
        }
    };

    const handleValidatePhone = (value: string) => {
        const clearedValueLength = getValues("phoneNumber").trim().length;
        if (clearedValueLength === 2) return true;
        if (!validatePhone(value)) return t("errors.phoneNumber");
        return true;
    };

    const handleValidateEmailField = (value: string) => {
        if (value.length === 0) return t("errors.requiredField");
        if (!validateEmail(value)) return t("errors.email");
        return true;
    };
    
    const handleSuccessfulPassing = (key: string | null) => {
        setIsCaptchaPassed(key ? true : false);
    };
    
    useEffect(() => {
        handleUpdateUnsavedDataExist(isDirty);
    }, [isDirty]);

    return (
        <form className="call-back-form" onSubmit={ handleSubmit(handleCreateNewFeedback) }>
            <FormControl>
                <FormLabel className="label">{ t("text.yourName") }</FormLabel>
                <TextField
                    error={ Boolean(errors.firstName) }
                    helperText={ String(errors.firstName?.message || "") }
                    placeholder={ t("text.yourName") }
                    { ...register("firstName", { 
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.yourSecondName") }</FormLabel>
                <TextField
                    error={ Boolean(errors.secondName) }
                    helperText={ String(errors.secondName?.message || "") }
                    placeholder={ t("text.yourSecondName") }
                    { ...register("secondName") }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.email") }</FormLabel>
                <TextField
                    error={ Boolean(errors.email) }
                    helperText={ String(errors.email?.message || "") }
                    placeholder={ t("text.email") }
                    { ...register("email", { 
                        validate: (value) => handleValidateEmailField(value)
                    }) }
                />
            </FormControl>
            <FormControl className="horizontal-field">
                <FormLabel className="label">
                    { t("text.attachments") }
                    <Controller
                        name="attachments"
                        control={ control }
                        render={ ({ field }) => (
                            <InputFile
                                { ...field }
                                width="25px"
                                height="25px"
                                multiple
                                accept=".png, .jpg, .jpeg, .mp4"
                                onChange={ (e) => {
                                    const files = e.target.files;
                                    const blobArray = convertFileListToAttachmentsFormatBlobArray(files);
                                    field.onChange(blobArray);
                                } }
                            />
                        ) }
                    />
                </FormLabel>
                <div className="attachments">
                    {
                        watch("attachments", []).map((attachment: IAttachment) => (
                            <FileAttachment
                                key={ attachment.src }
                                attachment={ attachment }
                            />
                        ))
                    }
                </div>
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.typeOfBid") }</FormLabel>
                <Controller
                    name="typeOfBid"
                    control={ control }
                    rules={ { required: t("errors.requiredField") } }
                    defaultValue={ t(`typesOfFeedbacks.${feedbackTypes[0]?.systemKey}`) }
                    render={ ({ field }) => (
                        <Autocomplete
                            { ...field }
                            options={ feedbackTypes.map(el => t(`typesOfFeedbacks.${el.systemKey}`)) }
                            onChange={ (_, value) => field.onChange(value) }
                            renderInput={ (params) => (
                                <TextField
                                    placeholder={ t("text.search") }
                                    { ...params }
                                    error={ Boolean(errors.typeOfBid) }
                                    helperText={ String(errors.typeOfBid?.message || "") }
                                />
                            ) }
                        />
                    ) }
                />
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.phoneNumber") }</FormLabel>
                <InputMask
                    { ...register("phoneNumber", {
                        validate: (value) => handleValidatePhone(value)
                    }) }
                    mask="+7 999 999 99 99"
                    maskChar=" "
                    alwaysShowMask={ true }
                >
                { (inputProps: any) => (
                    <TextField
                        error={ Boolean(errors.phoneNumber) }
                        helperText={ String(errors.phoneNumber?.message || "") }
                        { ...inputProps }
                    />
                ) }
                </InputMask>
            </FormControl>
            <FormControl>
                <FormLabel className="label">{ t("text.description") }</FormLabel>
                <TextField
                    error={ Boolean(errors.description) }
                    helperText={ String(errors.description?.message || "") }
                    multiline
                    minRows={ 3 }
                    maxRows={ 3 }
                    placeholder={ t("text.description") }
                    { ...register("description", { 
                        validate: (value) => validateRequiredField(value) ? true : t("errors.requiredField")
                    }) }
                />
            </FormControl>
            <FormControl>
                <ReCaptcha
                    title="text.verifyNotARobot"
                    handleSuccessfulPassing={ handleSuccessfulPassing }
                />
            </FormControl>
            <div className="form-actions">
                <Button 
                    type="submit" 
                    variant="contained"
                    disabled={ handleGetSubmitButtonDisabled() }
                >{ t("text.save") }</Button>
                <Button 
                    variant="contained" 
                    onClick={ handleCloseCreatingNewFeedback }
                >{ t("text.close") }</Button>
            </div>
        </form>
    );
}